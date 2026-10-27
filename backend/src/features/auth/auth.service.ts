import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { pool } from "../../db/postgres.js"
import { securityConfig } from '../../config/security.js'

type LoginInput = {
  email: string,
  password: string
}

type RegisterInput = {
  name: string,
  email: string,
  password: string
}

type LoginReturn = {
  token: string,
  user_id: string,
  name: string,
  email: string,
  role: string
}

type RegisterReturn = {
  user_id: string,
  name: string,
  email: string,
  role: string
}

const dummyPasswordHash = '$2b$12$I8Z23H/8axKcXEklSHf5COCrUt56oUgbXiyn9wdShd8IFJgUCAt1G'

const loginUser = async ({ email, password }: LoginInput): Promise <LoginReturn | null> => {
  const query = await pool.query(
    `SELECT user_id, name, email, password_hash, role FROM users WHERE email = $1`,
    [email]
  )
  const user = query.rows[0]

  const passwordCorrect = await bcrypt.compare(password, user?.password_hash ?? dummyPasswordHash)

  if (!user || !passwordCorrect) {
    return null
  }

  const token = jwt.sign({}, securityConfig.jwtSecret, {
    algorithm: securityConfig.jwtAlgorithm,
    expiresIn: securityConfig.jwtLifetimeSeconds,
    issuer: securityConfig.jwtIssuer,
    audience: securityConfig.jwtAudience,
    subject: String(user.user_id)
  })

  return {
    token,
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role
  }
}

const registerUser = async ({name, email, password}: RegisterInput): Promise <RegisterReturn> => {
  const password_hash = await bcrypt.hash(password, 12)
    const result = await pool.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, 'user')
      RETURNING user_id, name, email, role
    `, [name, email, password_hash])

    return result.rows[0]
  }

export {
  loginUser,
  registerUser
}
