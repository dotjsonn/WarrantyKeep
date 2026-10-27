import type { Request, Response, NextFunction } from 'express'

const authorize = (...allowedRoles: ('admin' | 'user')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action.' })
    }
    next()
  }
}

export { authorize }
