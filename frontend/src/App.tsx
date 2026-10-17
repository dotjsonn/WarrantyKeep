import { useState, type SubmitEvent } from "react"
import LoginPage from "./features/auth/pages/LoginPage"
import { login } from "./features/auth/services/authService"
import type { User } from "./features/auth/types/auth.types"

const App = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<User | null>(() => {
  const loggedUser = window.localStorage.getItem('loggedUser');
    if (loggedUser) {
      return JSON.parse(loggedUser)
    }
    return null
  })
  const [message, setMessage] = useState<string | null>(null)

  const handleLogin = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const user: User = await login({ email, password })
      window.localStorage.setItem('loggedUser',JSON.stringify(user))
      setUser(user)
      setEmail('')
      setPassword('')
      setMessage(`Welcome ${user.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      setMessage(message)
      setTimeout(() => {
        setMessage(null)
      }, 5000);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  return (
    <div>
      {user && (
        <div>
          <h1 className="font-bold text-2xl">WarrantyKeep</h1>
          <h2>Hello {user.name}</h2>
          <div>
            {message}
          </div>
          <button className="border-2 px-4 py-1 bg-gray-900 text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

      {!user && (
        <div>
          <LoginPage email={email} password={password} 
            handleEmail={({target}) => setEmail(target.value)}
            handlePassword={({target}) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <div>
            {message}
          </div>
        </div>
      )}


    </div>
  )
}

export default App