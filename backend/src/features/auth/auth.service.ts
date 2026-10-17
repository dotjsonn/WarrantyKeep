import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { pool } from "../../db/postgres.js"

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



const loginUser = async ({ email, password }: LoginInput): Promise <LoginReturn | null> => {
  const query = await pool.query(
    `SELECT user_id, name, email, password_hash, role FROM users WHERE email = $1`,
    [email]
  )
  if (query.rowCount === 0) {
    return null
  }

  const user = query.rows[0]

  const passwordCorrect = await bcrypt.compare(password, user.password_hash)

  if (!passwordCorrect) {
    return null
  }

  const userForToken = {
    id: user.user_id,
    email: user.email
  }

  const token = jwt.sign(userForToken, process.env.JWT_SECRET!, { expiresIn: 60 * 60 })

  return {
    token,
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role
  }
}

const registerUser = async ({name, email, password}: RegisterInput): Promise <RegisterReturn> => {
  const password_hash = await bcrypt.hash(password, 10)
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