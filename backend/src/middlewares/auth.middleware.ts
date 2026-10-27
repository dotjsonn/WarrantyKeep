import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { pool } from '../db/postgres.js'
import { securityConfig } from '../config/security.js'
import { bearerTokenPattern, isValidId } from '../utils/validationPatterns.js'

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get('authorization')
  const match = authorization?.match(bearerTokenPattern)
  const token = match?.[1]

  if (!token) {
    return res.status(401).json({ error: 'Please log in to continue.' })
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(token, securityConfig.jwtSecret, {
      algorithms: [securityConfig.jwtAlgorithm],
      issuer: securityConfig.jwtIssuer,
      audience: securityConfig.jwtAudience,
      maxAge: securityConfig.jwtLifetimeSeconds
    })
  } catch {
    return res.status(401).json({ error: 'Your session is invalid or has expired. Please log in again.' })
  }

  const now = Math.floor(Date.now() / 1000)
  if (typeof decodedToken === 'string' || !isValidId(decodedToken.sub) ||
    !Number.isSafeInteger(decodedToken.exp) || !Number.isSafeInteger(decodedToken.iat) ||
    decodedToken.iat! > now || decodedToken.exp! <= decodedToken.iat! ||
    decodedToken.exp! - decodedToken.iat! > securityConfig.jwtLifetimeSeconds) {
    return res.status(401).json({ error: 'Your session is invalid. Please log in again.' })
  }

  try {
    const result = await pool.query(
      `SELECT user_id, email, role
       FROM users
       WHERE user_id = $1`,
      [decodedToken.sub]
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
