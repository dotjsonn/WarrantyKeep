import type { Warranty, WarrantyRequest } from '../types/warranties.types'
import { apiRequest } from '../../../utils/apiRequest'

const baseUrl = '/api/warranties'

let token: string | null = null

const setToken = (newToken: string | null) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAuthorizationHeaders = (): { Authorization: string } => {
  if (!token) {
    throw new Error('Please log in to continue.')
  }

  return { Authorization: token }
}

const getWarranties = async (): Promise<Warranty[]> => {
  const headers = getAuthorizationHeaders()

  return apiRequest<Warranty[]>(baseUrl, {
    method: 'GET',
    headers
  }, 'Unable to load warranties right now. Please try again.')
}

const createWarranty = async (warranty: WarrantyRequest): Promise<WarrantyRequest> => {
  const headers = getAuthorizationHeaders()

  return apiRequest<WarrantyRequest>(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(warranty)
  }, 'Unable to create the warranty right now. Please try again.')
}

const updateWarranty = async (id: string, warranty: WarrantyRequest): Promise<WarrantyRequest> => {
  const headers = getAuthorizationHeaders()

  return apiRequest<WarrantyRequest>(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(warranty)
  }, 'Unable to update the warranty right now. Please try again.')
}

const removeWarranty = async (id: string): Promise<void> => {
  const headers = getAuthorizationHeaders()

  await apiRequest<void>(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers
  }, 'Unable to delete the warranty right now. Please try again.')
}

export {
  setToken,
  getWarranties,
  createWarranty,
  updateWarranty,
  removeWarranty
}
