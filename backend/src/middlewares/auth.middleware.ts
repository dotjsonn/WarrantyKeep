import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../db/postgres.js'

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | null = null
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '')
  } 
  if (!token) {
    return res.status(401).json({ error: 'Please log in to continue.' })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    next(new Error('JWT_SECRET is not configured'))
    return
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(token, secret)
  } catch {
    return res.status(401).json({ error: 'Your session is invalid or has expired. Please log in again.' })
  }

  if (typeof decodedToken === 'string' || !['string', 'number'].includes(typeof decodedToken.id)) {
    return res.status(401).json({ error: 'Your session is invalid. Please log in again.' })
  }

  try {
    const result = await pool.query(
      `SELECT user_id, email, role
       FROM users
       WHERE user_id = $1`,
      [decodedToken.id]
    )

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Your account is no longer available. Please log in again.' })
    }

    req.user = result.rows[0]
    next()
  } catch (error) {
    next(error)
  }
}

export { checkToken }
