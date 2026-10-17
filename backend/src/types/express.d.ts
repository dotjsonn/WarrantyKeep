declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      user_id: string
      email: string
      role: 'admin' | 'user'
    }
  }
}

export {}