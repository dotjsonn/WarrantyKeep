import 'dotenv/config'
import express from 'express'
import { authRouter } from './features/auth/auth.routes.js'
import { warrantyRouter } from './features/warranties/warranties.routes.js'
import { usersRouter } from './features/users/users.routes.js'
import { dashboardRouter } from './features/dashboard/dashboard.routes.js'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { handleError } from './middlewares/error.middleware.js'
import { cors } from './middlewares/cors.middleware.js'
import { requireHttps } from './middlewares/https.middleware.js'
import { securityConfig } from './config/security.js'

const app = express()

if (securityConfig.isProduction) app.set('trust proxy', 1)

app.use(helmet())
app.use(requireHttps)
app.use(cors)
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait and try again.' }
}))
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})
app.use(express.json({ limit: '16kb', strict: true }))

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'Okay'
  })
})

app.use('/api/auth', authRouter)
app.use('/api/warranties', warrantyRouter)
app.use('/api/list-users', usersRouter)
app.use('/api/dashboard', dashboardRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'The requested resource could not be found.' })
})

app.use(handleError)

export { app }
