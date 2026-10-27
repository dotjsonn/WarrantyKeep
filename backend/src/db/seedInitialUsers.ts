import 'dotenv/config'
import bcrypt from 'bcryptjs'
import type { PoolClient } from 'pg'
import { pool } from './postgres.js'
import { logServerError } from '../utils/logger.js'
import { placeholderSecretPattern } from '../utils/validationPatterns.js'

const seedInitialUsers = async () => {
  const environment = process.env.NODE_ENV ?? 'development'
  const users = [
    { prefix: 'ADMIN', role: 'admin' },
    ...(environment === 'production' ? [] : [
      { prefix: 'USER1', role: 'user' },
      { prefix: 'USER2', role: 'user' }
    ])
  ]
  let client: PoolClient | undefined

  try {
    if (!['production', 'development', 'test'].includes(environment)) {
      throw new Error('NODE_ENV must be production, development, or test.')
    }
    client = await pool.connect()
    await client.query('BEGIN')
    for (const user of users) {
      const name = process.env[`${user.prefix}_NAME`]?.trim()
      const email = process.env[`${user.prefix}_EMAIL`]?.trim().toLowerCase()
      const password = process.env[`${user.prefix}_PASSWORD`]

      if (!name || !email || !password) {
        throw new Error(`Credentials of initial users should be defined in env file. ${user.prefix}`)
      }

      if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
        throw new Error(`${user.prefix}_PASSWORD must be at least 12 characters and at most 72 UTF-8 bytes.`)
      }
      if (placeholderSecretPattern.test(password)) {
        throw new Error(`${user.prefix}_PASSWORD must not be an example placeholder.`)
      }

      const password_hash = await bcrypt.hash(password, 12)
      
      await client.query(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `, [name, email, password_hash, user.role])
    }
    await client.query('COMMIT')
    console.log('Seeding completed')
  } catch (error) {
    if (client) await client.query('ROLLBACK')
    logServerError('Seeding failed', error)
    process.exitCode = 1
  } finally {
    client?.release()
    await pool.end()
  }
}

seedInitialUsers()
