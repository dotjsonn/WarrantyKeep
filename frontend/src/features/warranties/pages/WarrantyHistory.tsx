import { useState } from 'react'
import { Link } from 'react-router'
import Pagination from '../../../components/Pagination'
import { getErrorMessage } from '../../../utils/errors'
import type { User } from '../../auth/types/auth.types'
import EditWarrantyModal from '../components/EditWarrantyModal'
import WarrantyTable from '../components/WarrantyTable'
import useWarranties from '../hooks/useWarranties'
import { removeWarranty } from '../services/warrantyService'
import type { Warranty } from '../types/warranties.types'

type WarrantyHistoryProps = {
  user: User;
  title: string;
  scope: 'own' | 'others';
}

type StatusFilter = 'all' | 'active' | 'expired'
const PAGE_SIZE = 8

const WarrantyHistory = ({ user, title, scope }: WarrantyHistoryProps) => {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const { warranties, pagination, summary, loading, error, refreshWarranties } = useWarranties({
    page, limit: PAGE_SIZE, scope, status, search, onPageOutOfRange: setPage
  })
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [messageIsError, setMessageIsError] = useState(false)

  const handleSaved = async () => {
    refreshWarranties()
    setMessageIsError(false)
    setMessage('Warranty updated.')
  }

  const handleDelete = async (warranty: Warranty) => {
    if (user.role !== 'admin' && warranty.user_id !== user.user_id) return
    if (!window.confirm(`Delete warranty for ${warranty.product_name}?`)) return

    try {
      await removeWarranty(warranty.warranty_id)
      setMessageIsError(false)
      setMessage('Warranty deleted.')
      refreshWarranties()
    } catch (error: unknown) {
      setMessageIsError(true)
      setMessage(getErrorMessage(error))
    }
  }

  const changeStatus = (nextStatus: StatusFilter) => {
    setStatus(nextStatus)
    setPage(1)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div>
      <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-[30px] sm:flex-row sm:flex-wrap sm:items-end sm:gap-5">
        <div className="min-w-0">
          <h1 className="m-0 font-heading text-[clamp(36px,5vw,54px)] leading-[0.98] font-extrabold tracking-[-0.04em]">{title}</h1>
          <p className="mt-2.5 mb-0 text-muted">{summary.all} warranties, newest purchase first.</p>
        </div>
        {scope === 'own' && (
          <Link className="inline-flex min-h-[46px] w-full shrink-0 items-center justify-center rounded-lg border-[1.5px] border-transparent bg-gold px-5 py-2.5 font-semibold text-[#1d2552] no-underline hover:brightness-105 sm:w-auto" to="/add-warranty">+ Add warranty</Link>
        )}
      </header>

      {(error ?? message) && (
        <div className={`mb-[18px] rounded-[5px_9px_9px_5px] border-[1.5px] border-line border-l-[5px] bg-surface px-4 py-3 font-medium ${error || messageIsError ? 'border-l-alert text-expired-text' : 'border-l-brand'}`} role={error || messageIsError ? 'alert' : 'status'}>
          {error ?? message}
        </div>
      )}

      <div className="mb-[18px] flex flex-wrap justify-between gap-4 max-md:flex-col" >
        <div className="grid min-w-0 max-w-full grid-cols-3 overflow-hidden rounded-lg border-[1.5px] border-line bg-surface max-md:w-full" role="group" aria-label="Filter warranties by status">
          {([
            ['all', 'All', summary.all],
            ['active', 'Active', summary.active],
            ['expired', 'Expired', summary.expired]
          ] as const).map(([value, label, count]) => (
            <button
              className="min-h-11 min-w-0 cursor-pointer border-0 bg-transparent px-2 py-2 text-sm font-medium focus-visible:-outline-offset-3 aria-[pressed=true]:bg-brand aria-[pressed=true]:text-white sm:px-[17px] sm:text-base"
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => changeStatus(value)}
            >
              <span className="block sm:inline">{label}</span>{' '}
              <span className="block wrap-anywhere sm:inline">({count})</span>
            </button>
          ))}
        </div>
        <label className="relative min-w-0 w-full max-w-[330px] max-md:max-w-none">
          <span className="sr-only">Search warranties</span>
          <svg className="pointer-events-none absolute top-1/2 left-[13px] size-[19px] -translate-y-1/2 fill-none stroke-muted stroke-2" viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" /></svg>
          <input
            className="h-11 w-full rounded-lg border-[1.5px] border-line bg-surface pr-3.5 pl-[42px] focus:border-brand focus:outline-none focus:shadow-[0_0_0_3px_rgb(64_86_161_/_14%)]"
            type="search"
            placeholder={scope === 'others' ? 'Search users or products' : 'Search products'}
            value={search}
            onChange={({ target }) => handleSearch(target.value)}
          />
        </label>
      </div>

      <section className="overflow-hidden rounded-[10px] border-[1.5px] border-line bg-surface" aria-busy={loading}>
        {loading
          ? <div className="px-6 py-10 text-center text-muted">Loading warranties…</div>
          : <WarrantyTable
              warranties={warranties}
              role={user.role}
              userId={user.user_id}
              onEdit={setEditingWarranty}
              onDelete={handleDelete}
            />}
        <Pagination
          page={pagination.page}
          totalPages={pagination.total_pages}
          onPageChange={setPage}
        />
      </section>

      {editingWarranty && (
        <EditWarrantyModal
          warranty={editingWarranty}
          onClose={() => setEditingWarranty(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

export default WarrantyHistory
