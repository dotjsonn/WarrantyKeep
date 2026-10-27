import type { RequestHandler } from 'express'
import { securityConfig } from '../config/security.js'

const requireHttps: RequestHandler = (req, res, next) => {
  // Render's internal liveness probes can arrive over HTTP. This endpoint
  // returns no account data; all authentication and business routes require TLS.
  const isHealthProbe = req.path === '/api/health' && ['GET', 'HEAD'].includes(req.method)
  if (!securityConfig.isProduction || req.secure || isHealthProbe) {
    next()
    return
  }

  res.status(400).json({ error: 'HTTPS is required.' })
}

export { requireHttps }
