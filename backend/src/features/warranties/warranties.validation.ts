import { controlCharactersPattern, isoDatePattern } from '../../utils/validationPatterns.js'

type WarrantyData = {
  name: string
  purchase_date: string
  warranty_months: number
  receipt_url: string | null
}

type WarrantyValidationResult = { data: WarrantyData; error?: never } | { error: string; data?: never }

const getTodayInManila = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

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

  if (controlCharactersPattern.test(name)) {
    return { error: 'The product name contains unsupported control characters.' }
  }

  if (typeof purchase_date !== 'string' || !isoDatePattern.test(purchase_date)) {
    return { error: 'Please enter a valid purchase date in YYYY-MM-DD format.' }
  }

  const date = new Date(purchase_date)

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== purchase_date) {
    return { error: 'Please enter a valid purchase date.' }
  }

  if (Number(purchase_date.slice(0, 4)) < 1900 || purchase_date > getTodayInManila()) {
    return { error: 'The purchase date must be between January 1, 1900 and today.' }
  }

  if (typeof warranty_months !== 'number' || !Number.isInteger(warranty_months) ||
    warranty_months < 1 || warranty_months > 120) {
    return { error: 'Warranty duration must be a whole number between 1 and 120 months.' }
  }

  if (receipt_url != null && (typeof receipt_url !== 'string' || !receipt_url.trim() || receipt_url !== receipt_url.trim())) {
    return { error: 'Enter a receipt URL without spaces at the beginning or end, or leave it blank.' }
  }

  if (typeof receipt_url === 'string') {
    if (receipt_url.length > 2048) {
      return { error: 'The receipt URL must be 2,048 characters or fewer.' }
    }

    try {
      const parsedUrl = new URL(receipt_url)
      if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) {
        return { error: 'The receipt URL must be a secure HTTPS link without embedded credentials.' }
      }
    } catch {
      return { error: 'Please enter a valid receipt URL.' }
    }
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
