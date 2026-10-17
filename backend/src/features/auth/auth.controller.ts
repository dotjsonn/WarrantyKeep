import type { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service.js";


const login = async (req: Request, res: Response) => {
  const loginFields = ['email', 'password']

  const otherFields = Object.keys(req.body).filter(field => !loginFields.includes(field))
  if (otherFields.length > 0) {
    return res.status(400).json({ error: 'Only email and password fields are allowed' })
  }

  const { email, password } = req.body
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ error: 'Email and password are required inputs' })
  }

  let user 
  try{
    user = await loginUser({
      email: email.trim(),
      password
    })
    if (!user) {
      return res.status(400).json({ error: 'Wrong email or password input' })
    }

    res.status(200).json(user)
  } catch (error: unknown) {
    console.error('Login Failed', error)
    res.status(500).json({ error: 'Login Failed' })
  }
}

const register = async (req: Request, res: Response) => {
  const registerFields = ['name', 'email', 'password']

  const otherFields = Object.keys(req.body).filter(field => !registerFields.includes(field))
  if (otherFields.length > 0) {
    return res.status(400).json({ error: 'Only name, email, password fields are allowed' })
  }

  const { name, email, password } = req.body
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password != 'string' 
    || !name.trim() || !email.trim() || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required inputs' })
    }
    
  try {
    const user = await registerUser({
      name: name.trim(),
      email: email.trim(),
      password
    })

    return res.status(201).json(user)

  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return res.status(409).json({ error: 'Email already registered. You must input unique email' })
    }
    console.error('Registration Failed', error)
    return res.status(500).json({error: 'Registration Failed'})
  }
}

export {
  login,
  register
}