import { app } from "./app.js"

import { connectPostgreSQL } from "./db/postgres.js"
import { logServerError } from './utils/logger.js'

const startServer = async () => {
  try {
    const port = Number(process.env.PORT ?? 3000)
    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
      throw new Error('PORT must be an integer between 1 and 65535.')
    }

    await connectPostgreSQL()
    console.log('Database connected')

    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on port ${port}`)
    })
  } catch (error) {
    logServerError('Error starting server', error)
    process.exitCode = 1
  }
}

startServer()
