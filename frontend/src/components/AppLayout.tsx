import { Outlet } from 'react-router'
import type { User } from '../features/auth/types/auth.types'
import Sidebar from './Sidebar'

type AppLayoutProps = {
  user: User;
  onLogout: () => void;
}

const AppLayout = ({ user, onLogout }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="min-w-0 flex-1 p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
