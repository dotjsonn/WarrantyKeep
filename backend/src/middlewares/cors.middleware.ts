import type { RequestHandler } from 'express'
import { securityConfig } from '../config/security.js'

const cors: RequestHandler = (req, res, next) => {
  const origin = req.get('origin')
  res.vary('Origin')

  if (!origin) {
    next()
    return
  }

  if (!securityConfig.frontendOrigins.has(origin)) {
    res.status(403).json({ error: 'This origin is not allowed to access the API.' })
    return
  }

  res.set({
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    'Access-Control-Max-Age': '600'
  })

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  next()
}

export { cors }
