import 'dotenv/config'
import express from 'express'
import { authRouter } from './features/auth/auth.routes.js'

const app = express()

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'Okay'
  })
})

app.use('/api/auth', authRouter)

export { app }