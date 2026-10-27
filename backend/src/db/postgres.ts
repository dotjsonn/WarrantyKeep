import pg from 'pg'
import 'dotenv/config'
import { logServerError } from '../utils/logger.js'

const { Pool } = pg

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Database URL should be defined')
}

const pool = new Pool ({
  connectionString: databaseUrl
})

pool.on('error', error => logServerError('Unexpected database pool error', error))

const connectPostgreSQL = async () => {
  await pool.query('SELECT 1')
}

export {
  pool,
  connectPostgreSQL
}
