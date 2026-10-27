import type { LoginRequest, RegisterRequest, User } from '../types/auth.types'
import { apiRequest } from '../../../utils/apiRequest'

const baseUrl = '/api/auth'

const login = async (credentials: LoginRequest): Promise<User> => {
  return apiRequest<User>(`${baseUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }, 'Unable to log in right now. Please try again.', {
    401: 'Incorrect email or password. Please try again.'
  })
}

const register = async (credentials: RegisterRequest): Promise<void> => {
  await apiRequest(`${baseUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  }, 'Unable to create your account right now. Please try again.')
}

export {
  login,
  register
}
