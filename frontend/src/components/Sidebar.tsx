import { NavLink } from 'react-router'
import type { User } from '../features/auth/types/auth.types'

type SidebarProps = {
  user: User;
  onLogout: () => void;
}

const getLinkClassName = ({ isActive }: { isActive: boolean }) => {
  return isActive
    ? 'block rounded bg-gray-900 px-3 py-2 text-white'
    : 'block rounded px-3 py-2 hover:bg-gray-200'
}

const Sidebar = ({ user, onLogout }: SidebarProps) => {
  return (
    <aside className="sticky top-0 flex h-dvh w-44 shrink-0 flex-col border-r bg-gray-50 p-4 sm:w-56">
      <h1 className="text-xl font-bold">WarrantyKeep</h1>

      <nav aria-label="Main navigation" className="mt-6 space-y-2">
        <NavLink to="/dashboard" className={getLinkClassName}>Dashboard</NavLink>
        <NavLink to="/add-warranty" className={getLinkClassName}>Add Warranty</NavLink>

        {user.role === 'admin' ? (
          <>
            <NavLink to="/users-warranty-history" className={getLinkClassName}>
              Users Warranty History
            </NavLink>
            <NavLink to="/admin-history" className={getLinkClassName}>Admin History</NavLink>
            <NavLink to="/users" className={getLinkClassName}>Users</NavLink>
          </>
        ) : (
          <NavLink to="/warranty-history" className={getLinkClassName}>Warranty History</NavLink>
        )}
      </nav>

      <button
        className="mt-auto rounded border px-4 py-2 text-left hover:bg-gray-200"
        type="button"
        onClick={onLogout}
      >
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
