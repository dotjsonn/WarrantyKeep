import { useState, type SubmitEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { getErrorMessage } from '../../../utils/errors'
import { login } from '../services/authService'
import type { User } from '../types/auth.types'

type LoginPageProps = {
  onLogin: (user: User) => void;
}

type RegistrationState = {
  registrationComplete?: boolean;
  email?: string;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const location = useLocation()
  const registration = location.state as RegistrationState | null
  const [email, setEmail] = useState(registration?.email ?? '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setMessage(null)
    setSubmitting(true)

    try {
      const user = await login({ email: email.trim().toLowerCase(), password })
      onLogin(user)
    } catch (error: unknown) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded border p-6">
        <h1 className="text-2xl font-bold">WarrantyKeep</h1>
        <h2 className="mt-2 text-xl">Login</h2>
        {registration?.registrationComplete && (
          <p role="status" className="mt-4 text-green-700">Registration complete. Please log in.</p>
        )}
        {message && <p role="alert" className="mt-4 text-red-600">{message}</p>}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit} aria-busy={submitting}>
          <label className="block">
            Email
            <input
              className="mt-1 block w-full rounded border p-2"
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              required
              maxLength={254}
            />
          </label>
          <label className="block">
            Password
            <input
              className="mt-1 block w-full rounded border p-2"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
            />
          </label>
          <button
            className="w-full rounded border bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link className="underline" to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
