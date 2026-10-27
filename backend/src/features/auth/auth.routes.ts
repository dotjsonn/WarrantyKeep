import { Router } from "express";
import { login, register } from "./auth.controller.js";
import { rateLimit } from 'express-rate-limit'

const authRouter = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: 'draft-8',
  legacyHeaders: false
})

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { error: 'Too many registration attempts. Please try again later.' },
  standardHeaders: 'draft-8',
  legacyHeaders: false
})

authRouter.post('/login', authLimiter, login)

authRouter.post('/register', registrationLimiter, register)


export {
  authRouter
}