import type { Request, Response } from "express";
import { loginUser, registerUser } from "./auth.service.js";
import { emailPattern } from '../../utils/validationPatterns.js'


const login = async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Please provide your email and password.' })
  }

  const loginFields = ['email', 'password']

  const otherFields = Object.keys(req.body).filter(field => !loginFields.includes(field))
  if (otherFields.length > 0) {
    return res.status(400).json({ error: 'Only email and password fields are allowed.' })
  }

  const { email, password } = req.body
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return res.status(400).json({ error: 'Please enter your email and password.' })
  }

  if (email.trim().length > 254 || !emailPattern.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address with 254 characters or fewer.' })
  }

  let user 
  try{
    user = await loginUser({
      email: email.trim().toLowerCase(),
      password
    })
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password. Please try again.' })
    }

    res.status(200).json(user)
  } catch (error: unknown) {
    console.error('Login Failed', error)
    res.status(500).json({ error: 'Unable to log in right now. Please try again later.' })
  }
}

const register = async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Please provide your name, email, and password.' })
  }

  const registerFields = ['name', 'email', 'password']

  const otherFields = Object.keys(req.body).filter(field => !registerFields.includes(field))
  if (otherFields.length > 0) {
    return res.status(400).json({ error: 'Only name, email, and password fields are allowed.' })
  }

  const { name, email, password } = req.body
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password != 'string' 
    || !name.trim() || !email.trim() || !password) {
      return res.status(400).json({ error: 'Please enter your name, email, and password.' })
    }

  if (name.trim().length > 255) {
    return res.status(400).json({ error: 'Your name must be 255 characters or fewer.' })
  }

  if (email.trim().length > 254 || !emailPattern.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address with 254 characters or fewer.' })
  }
    
  try {
    const user = await registerUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    })

    return res.status(201).json(user)

  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      return res.status(409).json({ error: 'This email is already registered. Please log in or use a different email address.' })
    }
    console.error('Registration Failed', error)
    return res.status(500).json({ error: 'Unable to create your account right now. Please try again later.' })
  }
}

export {
  login,
  register
}
