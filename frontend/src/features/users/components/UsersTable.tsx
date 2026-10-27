import type { ManagedUser } from '../types/users.types'

type UsersTableProps = {
  users: ManagedUser[];
  onDelete: (user: ManagedUser) => Promise<void>;
}

const UsersTable = ({ users, onDelete }: UsersTableProps) => {
  if (users.length === 0) return <p className="mt-4">No users found.</p>

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <button
                  className="rounded border px-3 py-1 text-red-600"
                  type="button"
                  onClick={() => onDelete(user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersTable
