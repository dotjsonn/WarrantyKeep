import 'dotenv/config'
import express from 'express'
import { authRouter } from './features/auth/auth.routes.js'
import { warrantyRouter } from './features/warranties/warranties.routes.js'
import { usersRouter } from './features/users/users.routes.js'
import helmet from 'helmet'
import { handleError } from './middlewares/error.middleware.js'

const app = express()

app.use(helmet())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'Okay'
  })
})

app.use('/api/auth', authRouter)
app.use('/api/warranties', warrantyRouter)
app.use('/api/list-users', usersRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'The requested resource could not be found.' })
})

app.use(handleError)

export { app }
