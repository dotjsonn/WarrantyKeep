import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('Database URL should be defined')
}

const pool = new Pool ({
  connectionString: databaseUrl
})

pool.on('error', (error) => {
  console.error('Error Connecting to database', error)
})

const connectPostgreSQL = async () => {
  await pool.query('SELECT 1')
}

export {
  pool,
  connectPostgreSQL
}