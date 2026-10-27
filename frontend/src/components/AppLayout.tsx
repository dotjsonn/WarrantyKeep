import { Outlet } from 'react-router'
import type { User } from '../features/auth/types/auth.types'
import Sidebar from './Sidebar'

type AppLayoutProps = {
  user: User;
  onLogout: () => void;
}

const AppLayout = ({ user, onLogout }: AppLayoutProps) => {
  return (
    <div className="grid min-h-dvh min-w-0 grid-cols-1 grid-rows-[auto_1fr] lg:grid-cols-[260px_minmax(0,1fr)] lg:grid-rows-1">
      <a className="sr-only fixed top-2 left-2 z-50 rounded-lg bg-gold p-3 text-[#1d2552] focus:not-sr-only" href="#main-content">Skip to content</a>
      <Sidebar user={user} onLogout={onLogout} />
      <main id="main-content" tabIndex={-1} className="min-w-0 wrap-anywhere px-4 pt-6 pb-12 sm:px-6 sm:pt-8 lg:px-[clamp(24px,4vw,56px)] lg:pt-11 lg:pb-16">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
