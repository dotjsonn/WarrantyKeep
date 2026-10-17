type WarrantyData = {
  name: string
  purchase_date: string
  warranty_months: number
  receipt_url: string | null
}

const validateWarrantyInput = (body: unknown): WarrantyData | null => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null

  const data = body as Record<string, unknown>
  const allowedFields = ['name', 'purchase_date', 'warranty_months', 'receipt_url']

  if (Object.keys(data).some(field => !allowedFields.includes(field))) return null

  const { name, purchase_date, warranty_months, receipt_url } = data

  if (
    typeof name !== 'string' || !name.trim() || name !== name.trim() || name.length > 255 ||
    typeof purchase_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(purchase_date) ||
    typeof warranty_months !== 'number' || !Number.isInteger(warranty_months) ||
    warranty_months < 1 || warranty_months > 120 ||
    (receipt_url != null && (typeof receipt_url !== 'string' || !receipt_url.trim() || receipt_url !== receipt_url.trim()))
  ) return null

  const date = new Date(purchase_date)

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== purchase_date) {
    return null
  }

  return {
    name,
    purchase_date,
    warranty_months,
    receipt_url: typeof receipt_url === 'string' ? receipt_url : null
  }
}

export { validateWarrantyInput }