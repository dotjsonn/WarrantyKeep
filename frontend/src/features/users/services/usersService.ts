import type { UsersPageResult } from '../types/users.types'
import { apiRequest } from '../../../utils/apiRequest'

const baseUrl = '/api/list-users'

const getUsers = async (
  token: string,
  { page = 1, limit = 8, search = '' }: { page?: number; limit?: number; search?: string } = {}
): Promise<UsersPageResult> => {
  const parameters = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search) parameters.set('search', search)

  return apiRequest<UsersPageResult>(`${baseUrl}?${parameters.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  }, 'Unable to load users right now. Please try again.')
}

const removeUser = async (id: string, token: string): Promise<void> => {
  await apiRequest<void>(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  }, 'Unable to delete the user right now. Please try again.')
}

export { getUsers, removeUser }
