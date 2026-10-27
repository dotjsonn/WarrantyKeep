import { isoDatePattern } from '../../utils/validationPatterns.js'

type WarrantyData = {
  name: string
  purchase_date: string
  warranty_months: number
  receipt_url: string | null
}

type WarrantyValidationResult = { data: WarrantyData; error?: never } | { error: string; data?: never }

const validateWarrantyInput = (body: unknown): WarrantyValidationResult => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Please provide the warranty details.' }
  }

  const data = body as Record<string, unknown>
  const allowedFields = ['name', 'purchase_date', 'warranty_months', 'receipt_url']

  if (Object.keys(data).some(field => !allowedFields.includes(field))) {
    return { error: 'Only name, purchase_date, warranty_months, and receipt_url fields are allowed.' }
  }

  const { name, purchase_date, warranty_months, receipt_url } = data

  if (typeof name !== 'string' || !name.trim()) {
    return { error: 'Please enter a product name.' }
  }

  if (name.length > 255) {
    return { error: 'The product name must be 255 characters or fewer.' }
  }

  if (name !== name.trim()) {
    return { error: 'Remove spaces from the beginning and end of the product name.' }
  }

  if (typeof purchase_date !== 'string' || !isoDatePattern.test(purchase_date)) {
    return { error: 'Please enter a valid purchase date in YYYY-MM-DD format.' }
  }

  const date = new Date(purchase_date)

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== purchase_date) {
    return { error: 'Please enter a valid purchase date.' }
  }

  if (typeof warranty_months !== 'number' || !Number.isInteger(warranty_months) ||
    warranty_months < 1 || warranty_months > 120) {
    return { error: 'Warranty duration must be a whole number between 1 and 120 months.' }
  }

  if (receipt_url != null && (typeof receipt_url !== 'string' || !receipt_url.trim() || receipt_url !== receipt_url.trim())) {
    return { error: 'Enter a receipt URL without spaces at the beginning or end, or leave it blank.' }
  }

  return {
    data: {
      name,
      purchase_date,
      warranty_months,
      receipt_url: typeof receipt_url === 'string' ? receipt_url : null
    }
  }
}

export { validateWarrantyInput }
