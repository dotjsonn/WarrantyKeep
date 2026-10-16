import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { pool } from './postgres.js'

const seedInitialUsers = async () => {
  const users = [
    { prefix: 'ADMIN', role: 'admin' },
    { prefix: 'USER1', role: 'user' },
    { prefix: 'USER2', role: 'user' }
  ]

  try {
    for (const user of users) {
      const name = process.env[`${user.prefix}_NAME`]?.trim()
      const email = process.env[`${user.prefix}_EMAIL`]?.trim().toLowerCase()
      const password = process.env[`${user.prefix}_PASSWORD`]

      if (!name || !email || !password) {
        throw new Error(`Credentials of initial users should be defined in env file. ${user.prefix}`)
      }

      const password_hash = await bcrypt.hash(password, 10)
      
      await pool.query(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
      `, [name, email, password_hash, user.role])
    }
    console.log('Seeding completed')
  } catch (error) {
    console.error('Seeding failed', error)
  } finally {
    await pool.end()
  }
}

seedInitialUsers()