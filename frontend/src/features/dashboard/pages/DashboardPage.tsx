import { Link } from 'react-router'
import type { User } from '../../auth/types/auth.types'
import useWarranties from '../../warranties/hooks/useWarranties'

type DashboardPageProps = {
  user: User;
}

const DashboardPage = ({ user }: DashboardPageProps) => {
  const { warranties, loading, error } = useWarranties()
  const myWarranties = warranties.filter(warranty => warranty.user_id === user.user_id)
  const myActiveCount = myWarranties.filter(warranty => warranty.status === 'active').length
  const myExpiredCount = myWarranties.filter(warranty => warranty.status === 'expired').length
  const allActiveCount = warranties.filter(warranty => warranty.status === 'active').length
  const allExpiredCount = warranties.filter(warranty => warranty.status === 'expired').length
  const hasLoadedWarranties = !loading && !error

  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <section aria-labelledby="about-you-title" className="mt-4 rounded border p-4">
        <h3 id="about-you-title" className="text-lg font-bold">About You</h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="font-semibold">Name</dt>
            <dd className="mt-1">{user.name}</dd>
          </div>
          <div>
            <dt className="font-semibold">Email</dt>
            <dd className="mt-1 break-all">{user.email}</dd>
          </div>
          <div>
            <dt className="font-semibold">Role</dt>
            <dd className="mt-1 capitalize">{user.role}</dd>
          </div>

          {hasLoadedWarranties && (
            <>
              <div>
                <dt className="font-semibold">My Warranties</dt>
                <dd className="mt-1 text-2xl font-bold">{myWarranties.length}</dd>
              </div>
              <div>
                <dt className="font-semibold">My Active Warranties</dt>
                <dd className="mt-1 text-2xl font-bold">{myActiveCount}</dd>
              </div>
              <div>
                <dt className="font-semibold">My Expired Warranties</dt>
                <dd className="mt-1 text-2xl font-bold">{myExpiredCount}</dd>
              </div>
            </>
          )}
        </dl>
      </section>

      {error && <p role="alert" className="mt-4 text-red-600">{error}</p>}
      {loading && <p className="mt-4">Loading warranties...</p>}
      {hasLoadedWarranties && user.role === 'admin' && (
        <section aria-labelledby="all-warranties-title" className="mt-6">
          <h3 id="all-warranties-title" className="text-lg font-bold">All Warranties Overview</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded border p-4">
              <p>All Warranties</p>
              <p className="mt-2 text-2xl font-bold">{warranties.length}</p>
            </div>
            <div className="rounded border p-4">
              <p>Active</p>
              <p className="mt-2 text-2xl font-bold">{allActiveCount}</p>
            </div>
            <div className="rounded border p-4">
              <p>Expired</p>
              <p className="mt-2 text-2xl font-bold">{allExpiredCount}</p>
            </div>
          </div>
        </section>
      )}

      <Link to="/add-warranty" className="mt-6 inline-block rounded border bg-gray-900 px-4 py-2 text-white">
        Add Warranty
      </Link>
    </div>
  )
}

export default DashboardPage
