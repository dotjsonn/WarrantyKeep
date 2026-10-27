import { apiRequest } from '../../../utils/apiRequest'
import type { DashboardData } from '../types/dashboard.types'

const getDashboard = (token: string) => {
  return apiRequest<DashboardData>('/api/dashboard', {
    headers: { Authorization: `Bearer ${token}` }
  }, 'Unable to load the dashboard right now. Please try again.')
}

export { getDashboard }
