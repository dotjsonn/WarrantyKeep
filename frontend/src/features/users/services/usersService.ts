import type { ManagedUser } from '../types/users.types'
import { apiRequest } from '../../../utils/apiRequest'

const baseUrl = '/api/list-users'

const getUsers = async (token: string): Promise<ManagedUser[]> => {
  return apiRequest<ManagedUser[]>(baseUrl, {
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
