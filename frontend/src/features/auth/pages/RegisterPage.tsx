import { useState, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { getErrorMessage } from '../../../utils/errors'
import { register } from '../services/authService'
import Brand from '../../../components/Brand'

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
    <div className="grid min-h-dvh min-w-0 place-items-center bg-[#4056a1] px-4 py-6 sm:px-5 sm:py-8">
      <div className="min-w-0 w-full max-w-[440px] wrap-anywhere rounded-[12px_12px_12px_42px] border-[1.5px] border-line bg-surface p-5 shadow-[0_24px_70px_rgb(29_37_82_/_20%)] sm:p-[34px]">
        <Brand />
        <div className="mt-[34px] mb-[22px]">
          <h1 className="m-0 font-heading text-[clamp(28px,7vw,36px)] leading-tight font-extrabold tracking-[-0.035em]">Create your account</h1>
          <p className="mt-2 mb-0 text-muted">Start tracking coverage before the paperwork disappears.</p>
        </div>
        {message && <p role="alert" className="mb-[18px] rounded-[5px_9px_9px_5px] border-[1.5px] border-line border-l-[5px] border-l-alert bg-surface px-4 py-3 font-medium text-expired-text">{message}</p>}

        <form className="grid gap-[17px]" onSubmit={handleSubmit} aria-busy={submitting}>
          <label className="flex flex-col gap-2 font-semibold">
            <span className="font-semibold">Name</span>
            <input
              className="h-[54px] min-w-0 w-full rounded-lg border-[1.5px] border-line bg-page px-4 font-normal focus:border-brand focus:outline-none focus:shadow-[0_0_0_3px_rgb(64_86_161_/_14%)]"
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={({ target }) => setName(target.value)}
              required
              maxLength={255}
            />
          </label>
          <label className="flex flex-col gap-2 font-semibold">
            <span className="font-semibold">Email</span>
            <input
              className="h-[54px] min-w-0 w-full rounded-lg border-[1.5px] border-line bg-page px-4 font-normal focus:border-brand focus:outline-none focus:shadow-[0_0_0_3px_rgb(64_86_161_/_14%)]"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              required
              maxLength={254}
            />
          </label>
          <label className="flex flex-col gap-2 font-semibold">
            <span className="font-semibold">Password</span>
            <input
              className="h-[54px] min-w-0 w-full rounded-lg border-[1.5px] border-line bg-page px-4 font-normal focus:border-brand focus:outline-none focus:shadow-[0_0_0_3px_rgb(64_86_161_/_14%)]"
              type="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
              minLength={12}
              maxLength={72}
            />
            <small className="font-normal text-muted">Use at least 12 characters (maximum 72 UTF-8 bytes).</small>
          </label>
          <button
            className="mt-1.5 inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-transparent bg-brand px-5 py-2.5 font-semibold text-white hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-[22px] mb-0 text-center text-muted">
          Already have an account? <Link className="font-semibold" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
