import { useState } from 'react'
import { NavLink } from 'react-router'
import type { User } from '../features/auth/types/auth.types'
import Brand from './Brand'

type SidebarProps = {
  user: User;
  onLogout: () => void;
}

const getLinkClassName = ({ isActive }: { isActive: boolean }) => {
  const base = 'flex min-h-11 min-w-0 items-center rounded-lg px-3.5 py-2.5 font-medium no-underline transition-colors'
  return isActive
    ? `${base} bg-sidebar-ink font-semibold text-[#1d2552]`
    : `${base} text-sidebar-ink hover:bg-[#efe2ba24]`
}

const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <aside className="sticky top-0 z-20 flex max-h-dvh min-w-0 flex-wrap items-center gap-3 self-start overflow-y-auto bg-sidebar px-4 py-3 text-sidebar-ink lg:h-dvh lg:flex-col lg:flex-nowrap lg:items-stretch lg:gap-7 lg:px-[18px] lg:py-7">
      <span className="min-w-0 flex-1 lg:flex-none"><Brand /></span>
      <button
        className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-[#efe2ba66] bg-transparent text-sidebar-ink hover:bg-[#efe2ba24] lg:hidden"
        type="button"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen(open => !open)}
      >
        <svg className="size-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
          <path d={menuOpen ? 'M6 6l12 12M6 18 18 6' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </button>

      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={`${menuOpen ? 'grid' : 'hidden'} min-h-0 w-full shrink-0 gap-1.5 sm:grid-cols-2 lg:flex lg:shrink lg:flex-col lg:overflow-y-auto [scrollbar-color:rgb(239_226_186_/_45%)_transparent] [scrollbar-width:thin]`}
      >
        <NavLink to="/dashboard" className={getLinkClassName} onClick={closeMenu}>Dashboard</NavLink>
        <NavLink to="/add-warranty" className={getLinkClassName} onClick={closeMenu}>Add warranty</NavLink>

        {user.role === 'admin' ? (
          <>
            <span className="mx-3.5 mt-4 mb-0.5 hidden text-xs font-bold tracking-[0.08em] uppercase lg:block">Admin</span>
            <NavLink to="/users-warranty-history" className={getLinkClassName} onClick={closeMenu}>
              User warranty history
            </NavLink>
            <NavLink to="/admin-history" className={getLinkClassName} onClick={closeMenu}>My warranty history</NavLink>
            <NavLink to="/users" className={getLinkClassName} onClick={closeMenu}>Users</NavLink>
          </>
        ) : (
          <NavLink to="/warranty-history" className={getLinkClassName} onClick={closeMenu}>Warranty history</NavLink>
        )}
      </nav>

      <div className={`${menuOpen ? 'flex' : 'hidden'} w-full shrink-0 flex-wrap items-center gap-3.5 border-t border-[#efe2ba33] pt-3 lg:mt-auto lg:grid lg:border-0 lg:pt-0`}>
        <div className="min-w-0 flex-1 px-2">
          <strong className="block overflow-hidden text-sm text-ellipsis whitespace-nowrap">{user.name}</strong>
          <small className="block overflow-hidden text-xs text-ellipsis whitespace-nowrap">
            {user.role === 'admin' ? 'Administrator' : user.email}
          </small>
        </div>
        <button
          className="min-h-11 shrink-0 cursor-pointer rounded-lg border-[1.5px] border-[#efe2ba66] bg-transparent px-3.5 py-2 text-left text-sidebar-ink hover:bg-[#efe2ba24]"
          type="button"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
