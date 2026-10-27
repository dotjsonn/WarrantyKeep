import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router'
import AppLayout from './components/AppLayout'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import { clearStoredUser, getStoredUser, getTokenExpiration, storeUser } from './features/auth/services/sessionStorage'
import type { User } from './features/auth/types/auth.types'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import UsersPage from './features/users/pages/UsersPage'
import AddWarrantyPage from './features/warranties/pages/AddWarrantyPage'
import WarrantyHistory from './features/warranties/pages/WarrantyHistory'
import { setToken } from './features/warranties/services/warrantyService'
import { unauthorizedEvent } from './utils/apiRequest'

const initialUser = getStoredUser()
setToken(initialUser?.token ?? null)

const App = () => {
  const [user, setUser] = useState<User | null>(initialUser)
  const navigate = useNavigate()

  const handleLogin = (loggedUser: User) => {
    storeUser(loggedUser)
    setToken(loggedUser.token)
    setUser(loggedUser)
    navigate('/dashboard', { replace: true })
  }

  const handleLogout = useCallback(() => {
    clearStoredUser()
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    const handleUnauthorized = (event?: Event) => {
      const rejectedToken = event instanceof CustomEvent ? event.detail?.token : undefined
      if (rejectedToken && rejectedToken !== user?.token) return
      clearStoredUser()
      setToken(null)
      setUser(null)
      navigate('/login', { replace: true, state: { sessionExpired: true } })
    }

    window.addEventListener(unauthorizedEvent, handleUnauthorized)
    const expiration = user ? getTokenExpiration(user.token) : null
    const timeout = expiration
      ? window.setTimeout(handleUnauthorized, Math.min(2_147_483_647, Math.max(0, expiration - Date.now())))
      : undefined
    const syncStoredSession = () => {
      const stored = getStoredUser()
      setToken(stored?.token ?? null)
      setUser(stored)
    }
    const checkExpiration = () => {
      if (expiration && expiration <= Date.now()) handleUnauthorized()
    }
    window.addEventListener('storage', syncStoredSession)
    window.addEventListener('focus', checkExpiration)

    return () => {
      window.removeEventListener(unauthorizedEvent, handleUnauthorized)
      window.removeEventListener('storage', syncStoredSession)
      window.removeEventListener('focus', checkExpiration)
      if (timeout !== undefined) window.clearTimeout(timeout)
    }
  }, [navigate, user])

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<AppLayout key={user.user_id} user={user} onLogout={handleLogout} />}>
        <Route path="/dashboard" element={<DashboardPage user={user} />} />
        <Route path="/add-warranty" element={<AddWarrantyPage />} />

        {user.role === 'admin' ? (
          <>
            <Route
              path="/users-warranty-history"
              element={
                <WarrantyHistory
                  key="others"
                  user={user}
                  scope="others"
                  title="Users Warranty History"
                />
              }
            />
            <Route
              path="/admin-history"
              element={
                <WarrantyHistory key="own" user={user} scope="own" title="Admin History" />
              }
            />
            <Route path="/users" element={<UsersPage token={user.token} />} />
          </>
        ) : (
          <Route
            path="/warranty-history"
            element={<WarrantyHistory user={user} scope="own" title="Warranty History" />}
          />
        )}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App
