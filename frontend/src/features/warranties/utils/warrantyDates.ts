export const getTodayInManila = (now = new Date()): string => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now)
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

// Match PostgreSQL's calendar-month arithmetic, including month-end clamping.
export const getWarrantyEndDate = (purchaseDate: string, months: number): string | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(purchaseDate) || !Number.isInteger(months) || months < 1 || months > 120) {
    return null
  }
  const source = new Date(`${purchaseDate}T00:00:00Z`)
  if (!Number.isFinite(source.getTime()) || source.toISOString().slice(0, 10) !== purchaseDate) return null
  const target = new Date(source)
  target.setUTCDate(1)
  target.setUTCMonth(target.getUTCMonth() + months)
  const lastDay = new Date(target)
  lastDay.setUTCMonth(lastDay.getUTCMonth() + 1)
  lastDay.setUTCDate(0)
  target.setUTCDate(Math.min(source.getUTCDate(), lastDay.getUTCDate()))
  return target.getUTCFullYear() > 9999 ? null : target.toISOString().slice(0, 10)
}
