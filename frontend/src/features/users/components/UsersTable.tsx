import type { ManagedUser } from '../types/users.types'

type UsersTableProps = {
  users: ManagedUser[];
  currentUserId: string;
  onDelete: (user: ManagedUser) => Promise<void>;
}

const UsersTable = ({ users, currentUserId, onDelete }: UsersTableProps) => {
  if (users.length === 0) return <p className="px-6 py-10 text-center text-muted">No users match your search.</p>

  const renderRole = (user: ManagedUser) => (
    <span className={`inline-flex shrink-0 rounded-md px-3 py-1 text-[13px] font-semibold capitalize ${user.role === 'admin' ? 'bg-gold text-[#1d2552]' : 'bg-cream text-ink'}`}>{user.role}</span>
  )
  const renderDelete = (user: ManagedUser) => user.user_id === currentUserId || user.role === 'admin'
    ? <span className="text-muted" aria-label="Account cannot be deleted">—</span>
    : <button className="min-h-11 min-w-11 cursor-pointer border-0 bg-transparent px-1 font-semibold whitespace-nowrap text-expired-text underline" type="button" onClick={() => onDelete(user)}>Delete</button>

  return (
    <>
      <ul className="m-0 grid list-none divide-y-[1.5px] divide-line p-0 lg:hidden" aria-label="Registered users">
        {users.map(user => (
          <li className="min-w-0 p-4 sm:p-5" key={user.user_id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <strong className="min-w-0 flex-1 basis-36 wrap-anywhere">{user.name}</strong>
              {renderRole(user)}
            </div>
            <p className="mt-2 mb-3 wrap-anywhere text-sm text-muted">{user.email}</p>
            <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line pt-2 text-sm">
              <span>{user.warranty_count} {user.warranty_count === 1 ? 'warranty' : 'warranties'}</span>
              {renderDelete(user)}
            </div>
          </li>
        ))}
      </ul>
      <div className="relative hidden max-w-full overflow-x-auto lg:block" role="region" aria-label="Users table" tabIndex={0}>
        <table className="w-full min-w-[680px] border-collapse text-left">
          <caption className="sr-only">Registered users, roles and warranty counts.</caption>
          <thead>
            <tr className="[&>th]:border-b-2 [&>th]:border-ink [&>th]:px-[18px] [&>th]:py-4 [&>th]:text-[13px] [&>th]:font-semibold [&>th]:tracking-[0.03em] [&>th]:text-muted [&>th]:uppercase">
              <th>Name</th><th>Email</th><th>Role</th><th>Warranties</th><th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr className="hover:bg-[#c5cbe321] [&>td]:border-b-[1.5px] [&>td]:border-line [&>td]:px-[18px] [&>td]:py-4 [&>td]:align-middle last:[&>td]:border-b-0" key={user.user_id}>
                <td className="min-w-32"><strong className="block max-w-64 wrap-anywhere">{user.name}</strong></td>
                <td className="wrap-anywhere text-muted">{user.email}</td>
                <td>{renderRole(user)}</td>
                <td>{user.warranty_count}</td>
                <td>{renderDelete(user)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default UsersTable
