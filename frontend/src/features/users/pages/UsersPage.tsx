import { useEffect, useState } from 'react'
import { getErrorMessage } from '../../../utils/errors'
import UsersTable from '../components/UsersTable'
import { getUsers, removeUser } from '../services/usersService'
import type { ManagedUser } from '../types/users.types'

type UsersPageProps = {
  token: string;
}

const UsersPage = ({ token }: UsersPageProps) => {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    const loadUsers = async () => {
      try {
        const data = await getUsers(token)
        if (!ignore) setUsers(data)
      } catch (error: unknown) {
        if (!ignore) setMessage(getErrorMessage(error))
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadUsers()
    return () => {
      ignore = true
    }
  }, [token])

  const handleDelete = async (user: ManagedUser) => {
    if (!window.confirm(`Delete ${user.name} and all their warranties?`)) return

    try {
      await removeUser(user.user_id, token)
      setUsers(await getUsers(token))
      setMessage('User deleted')
    } catch (error: unknown) {
      setMessage(getErrorMessage(error))
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Users</h2>
      <p className="mt-2">Deleting a user also deletes their warranties.</p>
      {message && <p role="status" className="mt-4">{message}</p>}

      {loading && <p className="mt-4">Loading users...</p>}
      {!loading && <UsersTable users={users} onDelete={handleDelete} />}
    </div>
  )
}

export default UsersPage
