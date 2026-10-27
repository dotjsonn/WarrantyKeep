import { useEffect, useState } from 'react'
import Pagination from '../../../components/Pagination'
import { getErrorMessage } from '../../../utils/errors'
import UsersTable from '../components/UsersTable'
import { getUsers, removeUser } from '../services/usersService'
import type { ManagedUser, UsersPageResult } from '../types/users.types'

type UsersPageProps = {
  token: string;
  currentUserId: string;
}

const PAGE_SIZE = 8

const UsersPage = ({ token, currentUserId }: UsersPageProps) => {
  const [data, setData] = useState<UsersPageResult>({
    items: [],
    pagination: { page: 1, limit: PAGE_SIZE, total: 0, total_pages: 0 }
  })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [messageIsError, setMessageIsError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [refreshVersion, setRefreshVersion] = useState(0)

  useEffect(() => {
    let ignore = false
    const loadUsers = async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const result = await getUsers(token, { page, limit: PAGE_SIZE, search })
        if (!ignore) {
          const lastPage = Math.max(1, result.pagination.total_pages)
          if (page > lastPage) setPage(lastPage)
          setData(result)
        }
      } catch (error: unknown) {
        if (!ignore) {
          setData({ items: [], pagination: { page, limit: PAGE_SIZE, total: 0, total_pages: 0 } })
          setLoadError(getErrorMessage(error))
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    void loadUsers()
    return () => { ignore = true }
  }, [page, search, token, refreshVersion])

  const handleDelete = async (user: ManagedUser) => {
    if (!window.confirm(`Delete ${user.name} and all their warranties?`)) return

    try {
      await removeUser(user.user_id, token)
      setMessageIsError(false)
      setMessage('User deleted.')
      setRefreshVersion(version => version + 1)
    } catch (error: unknown) {
      setMessageIsError(true)
      setMessage(getErrorMessage(error))
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-5 sm:mb-[30px]">
        <div className="min-w-0">
          <h1 className="m-0 font-heading text-[clamp(36px,5vw,54px)] leading-[0.98] font-extrabold tracking-[-0.04em]">Users</h1>
          <p className="mt-2.5 mb-0 text-muted">{data.pagination.total} registered. Deleting a user also deletes their warranties.</p>
        </div>
      </header>

      {(loadError ?? message) && (
        <div className={`mb-[18px] rounded-[5px_9px_9px_5px] border-[1.5px] border-line border-l-[5px] bg-surface px-4 py-3 font-medium ${loadError || messageIsError ? 'border-l-alert text-expired-text' : 'border-l-gold'}`} role={loadError || messageIsError ? 'alert' : 'status'}>
          {loadError ?? message}
        </div>
      )}

      <div className="mb-[18px] flex justify-end gap-4 max-md:flex-col">
        <label className="relative min-w-0 w-full max-w-[330px] max-md:max-w-none">
          <span className="sr-only">Search users</span>
          <svg className="pointer-events-none absolute top-1/2 left-[13px] size-[19px] -translate-y-1/2 fill-none stroke-muted stroke-2" viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" /></svg>
          <input
            className="h-11 w-full rounded-lg border-[1.5px] border-line bg-surface pr-3.5 pl-[42px] focus:border-brand focus:outline-none focus:shadow-[0_0_0_3px_rgb(64_86_161_/_14%)]"
            type="search"
            placeholder="Search users"
            value={search}
            onChange={({ target }) => {
              setSearch(target.value)
              setPage(1)
            }}
          />
        </label>
      </div>

      <section className="overflow-hidden rounded-[10px] border-[1.5px] border-line bg-surface" aria-busy={loading}>
        {loading
          ? <div className="px-6 py-10 text-center text-muted">Loading users…</div>
          : <UsersTable users={data.items} currentUserId={currentUserId} onDelete={handleDelete} />}
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.total_pages}
          onPageChange={setPage}
        />
      </section>
    </div>
  )
}

export default UsersPage
