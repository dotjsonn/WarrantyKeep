import { pool } from "../../db/postgres.js";

type GetUsersInput = {
  page: number;
  limit: number;
  offset: number;
  search: string;
}

const getUsers = async ({ page, limit, offset, search }: GetUsersInput) => {
  const [itemsResult, countResult] = await Promise.all([
    pool.query(`
      SELECT
        u.user_id,
        u.name,
        u.email,
        u.role,
        COUNT(w.warranty_id)::int AS warranty_count
      FROM users u
      LEFT JOIN warranties w ON w.user_id = u.user_id
      WHERE $1 = '' OR u.name ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%'
      GROUP BY u.user_id, u.name, u.email, u.role
      ORDER BY CASE WHEN u.role = 'admin' THEN 0 ELSE 1 END, u.name, u.user_id
      LIMIT $2 OFFSET $3
    `, [search, limit, offset]),
    pool.query(`
      SELECT COUNT(*)::int AS total
      FROM users
      WHERE $1 = '' OR name ILIKE '%' || $1 || '%' OR email ILIKE '%' || $1 || '%'
    `, [search])
  ])

  const total = Number(countResult.rows[0].total)
  return {
    items: itemsResult.rows,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit)
    }
  }
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
