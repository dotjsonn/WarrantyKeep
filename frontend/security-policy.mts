export const getApiOrigin = (value = '', production = false) => {
  const origin = value.trim().replace(/\/+$/, '')
  if (!origin) return ''
  const url = new URL(origin)
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
    throw new Error('VITE_API_BASE_URL must be an HTTP(S) origin without a path or credentials.')
  }
  if (production && url.protocol !== 'https:') {
    throw new Error('VITE_API_BASE_URL must use HTTPS in production.')
  }
  return origin
}

export const createContentSecurityPolicy = (apiOrigin = '', development = false) => [
  "default-src 'self'",
  `script-src 'self'${development ? " 'unsafe-inline'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self'",
  `connect-src 'self'${apiOrigin ? ` ${apiOrigin}` : ''}${development ? ' ws://localhost:5173 ws://127.0.0.1:5173' : ''}`,
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'"
].join('; ')
