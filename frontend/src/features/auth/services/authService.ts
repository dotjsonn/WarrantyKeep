import type { LoginRequest, User } from "../types/auth.types";

const baseUrl = '/api/auth'

const login = async (credentials: LoginRequest): Promise<User> => {
  try {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      throw new Error(`Error! Status ${response.status}`)
    }

    const data = await response.json()
    console.log('Success')
    return data
  } catch (error) {
    throw new Error('Error logging in', { cause: error })
  }
}

export {
  login
}