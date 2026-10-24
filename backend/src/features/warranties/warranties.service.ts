import { pool } from "../../db/postgres.js";

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
};


const getWarranties = async ({ role, id }: User) => {
  const result = await pool.query(`
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
      WHERE ($1 = 'admin') OR (w.user_id = $2)
    )
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
    FROM warranty_data
  `, [role, id])

  return result.rows
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

const removeWarranty = async (warranty_id: string) => {
  await pool.query(`
    DELETE FROM warranties
    WHERE warranty_id = $1
  `, [warranty_id])
}

export {
  getWarranties,
  createWarranty,
  updateWarranty,
  removeWarranty
}