import type { User } from '../types/auth.types'

const storageKey = 'loggedUser'

const getTokenPayload = (token: string): Record<string, unknown> | null => {
  try {
    const segments = token.split('.')
    const encodedPayload = segments[1]
    if (segments.length !== 3 || !encodedPayload || !segments[2]) return null
    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const payload: unknown = JSON.parse(window.atob(padded))
    return payload && typeof payload === 'object' ? payload as Record<string, unknown> : null
  } catch {
    return null
  }
}

export const getTokenExpiration = (token: string): number | null => {
  const expiration = getTokenPayload(token)?.exp
  return typeof expiration === 'number' && Number.isSafeInteger(expiration) && expiration > 0 &&
    Number.isSafeInteger(expiration * 1000) ? expiration * 1000 : null
}

export const clearStoredUser = (): void => {
  try {
    window.localStorage.removeItem(storageKey)
  } catch {
    // Storage can be disabled by browser policy. In-memory logout must still succeed.
  }
}

export const getStoredUser = (): User | null => {
  try {
    const storedUser = window.localStorage.getItem(storageKey)
    if (!storedUser) return null

    const parsed: unknown = JSON.parse(storedUser)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      clearStoredUser()
      return null
    }
    const user = parsed as Partial<User>
    const expiration = typeof user.token === 'string' ? getTokenExpiration(user.token) : null
    const hasValidToken = typeof user.token === 'string' && Boolean(expiration && expiration > Date.now())
    const hasValidRole = user.role === 'user' || user.role === 'admin'
    const hasValidProfile = typeof user.user_id === 'string' && /^[1-9]\d{0,18}$/.test(user.user_id) &&
      typeof user.name === 'string' && Boolean(user.name.trim()) && user.name.length <= 255 &&
      typeof user.email === 'string' && user.email.length <= 254

    if (hasValidToken && hasValidRole && hasValidProfile) return user as User
    clearStoredUser()
    return null
  } catch {
    clearStoredUser()
    return null
  }
}

export const storeUser = (user: User): void => {
  // Store only the fields required for authentication and the visible account details.
  window.localStorage.setItem(storageKey, JSON.stringify({
    token: user.token, user_id: user.user_id, name: user.name, email: user.email, role: user.role
  }))
}
