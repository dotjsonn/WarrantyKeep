import { app } from "./app.js"

import { connectPostgreSQL } from "./db/postgres.js"

const startServer = async () => {
  try {
    const PORT = process.env.PORT ?? 3000

    await connectPostgreSQL()
    console.log('Database connected')

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    console.error('Error starting server', error)
    process.exitCode = 1
  }
}

startServer()