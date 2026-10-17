import { pool } from "../../db/postgres.js";

const getUsers = async () => {
  const result = await pool.query(`
    SELECT user_id, name, email
    FROM users
  `)
  if (result.rowCount === 0) {
    return null
  }
  return result.rows
}

const removeUser = async (id: string) => {
  await pool.query(`
    DELETE FROM users
    WHERE user_id = $1
  `, [id])
}

export {
  getUsers,
  removeUser
}