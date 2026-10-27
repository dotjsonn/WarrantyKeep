import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { getErrorMessage } from '../../../utils/errors'
import { register } from '../services/authService'

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setMessage(null)
    setSubmitting(true)

    try {
      const registeredEmail = email.trim().toLowerCase()
      await register({ name: name.trim(), email: registeredEmail, password })
      navigate('/login', {
        replace: true,
        state: { registrationComplete: true, email: registeredEmail }
      })
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
        <h2 className="mt-2 text-xl">Register</h2>
        {message && <p role="alert" className="mt-4 text-red-600">{message}</p>}

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            Name
            <input
              className="mt-1 block w-full rounded border p-2"
              type="text"
              value={name}
              onChange={({ target }) => setName(target.value)}
              required
              maxLength={255}
            />
          </label>
          <label className="block">
            Email
            <input
              className="mt-1 block w-full rounded border p-2"
              type="email"
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
              autoComplete="new-password"
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
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account? <Link className="underline" to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
