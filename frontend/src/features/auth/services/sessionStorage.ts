import type { User } from '../types/auth.types'

const storageKey = 'loggedUser'

export const getStoredUser = (): User | null => {
  try {
    const storedUser = window.localStorage.getItem(storageKey)
    if (!storedUser) return null

    const user: User = JSON.parse(storedUser)
    const hasValidToken = typeof user.token === 'string'
    const hasValidRole = user.role === 'user' || user.role === 'admin'

    return hasValidToken && hasValidRole ? user : null
  } catch {
    return null
  }
}

export const storeUser = (user: User): void => {
  window.localStorage.setItem(storageKey, JSON.stringify(user))
}

export const clearStoredUser = (): void => {
  window.localStorage.removeItem(storageKey)
}
