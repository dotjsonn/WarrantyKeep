import { pool } from '../../db/postgres.js'

type WarrantyInput = {
  warranty_id?: string,
  user_id: string,
  name: string,
  purchase_date: string,
  warranty_months: number,
  receipt_url: string | null,
}
type User = {
  role: string;
  id: string;
  scope: string;
  status: string;
  search: string;
  page: number;
  limit: number;
  offset: number;
};

const warrantyDataCte = `
    WITH warranty_data AS (
      SELECT
        w.warranty_id,
        w.name AS product_name,
        w.purchase_date,
        w.warranty_months,
        w.receipt_url,
        u.user_id,
        u.name AS user_name,
        u.email AS user_email,
        (w.purchase_date + make_interval(months => w.warranty_months))::date AS expiry_date,
        (statement_timestamp() AT TIME ZONE 'Asia/Manila')::date AS today
      FROM warranties w
      INNER JOIN users u ON w.user_id = u.user_id
    ), scoped_warranties AS (
      SELECT *
      FROM warranty_data
      WHERE (
        ($1 = 'admin' AND (
          $3 = 'all'
          OR ($3 = 'own' AND user_id = $2)
          OR ($3 = 'others' AND user_id <> $2)
        ))
        OR ($1 <> 'admin' AND user_id = $2)
      )
      AND (
        $4 = ''
        OR product_name ILIKE '%' || $4 || '%'
        OR user_name ILIKE '%' || $4 || '%'
        OR user_email ILIKE '%' || $4 || '%'
      )
    )
`

const getWarranties = async ({ role, id, scope, status, search, page, limit, offset }: User) => {
  const params = [role, id, scope, search]
  const [itemsResult, countResult, summaryResult] = await Promise.all([
    pool.query(`${warrantyDataCte}
    SELECT
      warranty_id,
      product_name,
      to_char(purchase_date, 'YYYY-MM-DD') AS purchase_date,
      warranty_months,
      receipt_url,
      user_id,
      user_name,
      user_email,
      to_char(expiry_date, 'YYYY-MM-DD') AS expires_on,
      CASE
        WHEN expiry_date < today THEN 'expired'
        ELSE 'active'
      END AS status
    FROM scoped_warranties
    WHERE (
      $5 = 'all'
      OR ($5 = 'active' AND expiry_date >= today)
      OR ($5 = 'expired' AND expiry_date < today)
    )
    ORDER BY purchase_date DESC, warranty_id DESC
    LIMIT $6 OFFSET $7
  `, [...params, status, limit, offset]),
    pool.query(`${warrantyDataCte}
      SELECT COUNT(*)::int AS total
      FROM scoped_warranties
      WHERE (
        $5 = 'all'
        OR ($5 = 'active' AND expiry_date >= today)
        OR ($5 = 'expired' AND expiry_date < today)
      )
    `, [...params, status]),
    pool.query(`${warrantyDataCte}
      SELECT
        COUNT(*)::int AS all,
        COUNT(*) FILTER (WHERE expiry_date >= today)::int AS active,
        COUNT(*) FILTER (WHERE expiry_date < today)::int AS expired
      FROM scoped_warranties
    `, params)
  ])

  const total = Number(countResult.rows[0].total)

  return {
    items: itemsResult.rows,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit)
    },
    summary: summaryResult.rows[0]
  }
}

const createWarranty = async ({user_id, name, purchase_date, warranty_months, receipt_url}: WarrantyInput) => {
  const result = await pool.query(`
    INSERT INTO warranties (user_id, name, purchase_date, warranty_months, receipt_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, name, purchase_date, warranty_months, receipt_url
  `, [user_id, name, purchase_date, warranty_months, receipt_url])

  if (result.rowCount === 0) {
    return null
  }
  return result.rows[0]
}

const updateWarranty = async ({warranty_id, user_id, name, purchase_date, warranty_months, receipt_url}: WarrantyInput) => {
  const result = await pool.query (`
    UPDATE warranties
    SET name = $1, purchase_date = $2, warranty_months = $3, receipt_url = $4, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $5 and warranty_id = $6
    RETURNING name, purchase_date, warranty_months, receipt_url
  `, [name, purchase_date, warranty_months, receipt_url, user_id, warranty_id])

  if (result.rowCount === 0) {
    return null
  }
  return result.rows[0]
}

const removeWarranty = async ({ warranty_id, user_id, role }: {
  warranty_id: string;
  user_id: string;
  role: 'user' | 'admin';
}) => {
  const result = await pool.query(`
    DELETE FROM warranties
    WHERE warranty_id = $1 AND ($2 = 'admin' OR user_id = $3)
  `, [warranty_id, role, user_id])
  return result.rowCount !== 0
}

export {
  getWarranties,
  createWarranty,
  updateWarranty,
  removeWarranty
}
