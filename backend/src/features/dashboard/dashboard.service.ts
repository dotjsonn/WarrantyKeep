import { pool } from '../../db/postgres.js'

const today = `(statement_timestamp() AT TIME ZONE 'Asia/Manila')::date`
const expiry = `(w.purchase_date + make_interval(months => w.warranty_months))::date`

const getOwnSummary = async (userId: string) => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total_warranties,
      COUNT(*) FILTER (WHERE ${expiry} >= ${today})::int AS active,
      COUNT(*) FILTER (WHERE ${expiry} < ${today})::int AS expired
    FROM warranties w
    WHERE w.user_id = $1
  `, [userId])

  return result.rows[0]
}

const getUserDashboard = async (userId: string) => {
  const [summary, activeResult] = await Promise.all([
    getOwnSummary(userId),
    pool.query(`
      SELECT
        w.warranty_id,
        w.name AS product_name,
        to_char(${expiry}, 'YYYY-MM-DD') AS expires_on,
        (${expiry} - ${today})::int AS days_remaining
      FROM warranties w
      WHERE w.user_id = $1 AND ${expiry} >= ${today}
      ORDER BY ${expiry}, w.warranty_id
      LIMIT 6
    `, [userId])
  ])

  return {
    role: 'user',
    summary,
    active_warranties: activeResult.rows
  }
}

const getAdminDashboard = async (userId: string) => {
  const [summaryResult, own, monthlyResult, topUsersResult] = await Promise.all([
    pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM users) AS users,
        COUNT(*)::int AS total_warranties,
        COUNT(*) FILTER (WHERE ${expiry} >= ${today})::int AS active,
        COUNT(*) FILTER (WHERE ${expiry} < ${today})::int AS expired
      FROM warranties w
    `),
    getOwnSummary(userId),
    pool.query(`
      WITH bounds AS (
        SELECT date_trunc('month', ${today})::date AS current_month
      ), months AS (
        SELECT generate_series(
          current_month - INTERVAL '5 months',
          current_month + INTERVAL '6 months',
          INTERVAL '1 month'
        )::date AS month, current_month
        FROM bounds
      ), warranty_expiries AS (
        SELECT ${expiry} AS expiry_date
        FROM warranties w
      )
      SELECT
        to_char(months.month, 'YYYY-MM') AS month,
        to_char(months.month, 'Mon') AS label,
        CASE
          WHEN months.month < months.current_month THEN 'past'
          WHEN months.month = months.current_month THEN 'current'
          ELSE 'future'
        END AS period,
        COUNT(warranty_expiries.expiry_date)::int AS count,
        COUNT(warranty_expiries.expiry_date) FILTER (
          WHERE warranty_expiries.expiry_date >= ${today}
        )::int AS active_count
      FROM months
      LEFT JOIN warranty_expiries
        ON date_trunc('month', warranty_expiries.expiry_date)::date = months.month
      GROUP BY months.month, months.current_month
      ORDER BY months.month
    `),
    pool.query(`
      SELECT
        u.user_id,
        u.name,
        COUNT(w.warranty_id)::int AS total,
        COUNT(w.warranty_id) FILTER (WHERE ${expiry} >= ${today})::int AS active,
        COUNT(w.warranty_id) FILTER (WHERE ${expiry} < ${today})::int AS expired
      FROM users u
      LEFT JOIN warranties w ON w.user_id = u.user_id
      GROUP BY u.user_id, u.name
      ORDER BY total DESC, u.name
      LIMIT 6
    `)
  ])

  return {
    role: 'admin',
    summary: summaryResult.rows[0],
    own_summary: own,
    expiries_by_month: monthlyResult.rows,
    top_users: topUsersResult.rows
  }
}

const getDashboard = (user: { id: string; role: string }) => {
  return user.role === 'admin' ? getAdminDashboard(user.id) : getUserDashboard(user.id)
}

export { getDashboard }
