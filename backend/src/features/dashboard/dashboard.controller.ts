import type { Request, Response } from 'express'
import { getDashboard } from './dashboard.service.js'
import { logServerError } from '../../utils/logger.js'

const get = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Please log in to continue.' })
  }

  try {
    const dashboard = await getDashboard({ id: req.user.user_id, role: req.user.role })
    return res.status(200).json(dashboard)
  } catch (error: unknown) {
    logServerError('Dashboard lookup failed', error)
    return res.status(500).json({ error: 'Unable to load the dashboard right now. Please try again later.' })
  }
}

export { get }
