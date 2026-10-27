import type { ErrorRequestHandler } from 'express'
import { logServerError } from '../utils/logger.js'

const handleError: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }

  if (error && typeof error === 'object' && 'type' in error) {
    switch (error.type) {
      case 'entity.parse.failed':
        res.status(400).json({ error: 'The request contains invalid JSON. Please check the submitted data.' })
        return
      case 'entity.too.large':
        res.status(413).json({ error: 'The submitted data is too large. Please reduce its size and try again.' })
        return
      case 'charset.unsupported':
      case 'encoding.unsupported':
        res.status(415).json({ error: 'The request uses an unsupported encoding. Please send JSON using UTF-8.' })
        return
    }
  }

  logServerError('Unexpected request error', error)
  res.status(500).json({ error: 'Something went wrong on the server. Please try again later.' })
}

export { handleError }
