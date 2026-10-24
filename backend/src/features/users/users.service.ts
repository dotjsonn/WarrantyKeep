import { pool } from "../../db/postgres.js";

const getUsers = async () => {
  const result = await pool.query(`
    SELECT user_id, name, email
    FROM users
    WHERE role = 'user'
    ORDER BY user_id
  `)
  return result.rows
}

const removeUser = async (id: string) => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await client.query(`
      SELECT user_id 
      FROM users
      WHERE user_id = $1 AND role = 'user'
      FOR UPDATE
    `, [id])

    if (result.rowCount === 0) {
      await client.query('ROLLBACK')
      return false
    }

    await client.query('DELETE FROM warranties WHERE user_id = $1', [id])
    await client.query('DELETE FROM users WHERE user_id = $1', [id])
    await client.query('COMMIT')
    return true
  } catch (error: unknown) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export {
  getUsers,
  removeUser
}