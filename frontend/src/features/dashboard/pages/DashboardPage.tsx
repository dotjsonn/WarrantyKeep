import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getErrorMessage } from '../../../utils/errors'
import type { User } from '../../auth/types/auth.types'
import { getDashboard } from '../services/dashboardService'
import type { AdminDashboard, DashboardData, UserDashboard } from '../types/dashboard.types'

type DashboardPageProps = { user: User }

const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
}).format(new Date(`${value}T00:00:00`))

const formatTimeLeft = (days: number) => days < 60
  ? `${days} ${days === 1 ? 'day' : 'days'} left`
  : `${Math.round(days / 30.44)} mo left`

const metricVariants = {
  total: 'bg-cream text-ink',
  gold: 'bg-gold text-[#1d2552]',
  active: 'bg-brand text-white',
  expired: 'bg-alert text-white'
} as const

const panelClass = 'min-w-0 rounded-[10px] border-[1.5px] border-line bg-surface p-4 sm:p-[26px]'

const MetricCard = ({ value, label, variant }: {
  value: number;
  label: string;
  variant: 'total' | 'gold' | 'active' | 'expired';
}) => (
  <div className={`flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-[10px_10px_10px_28px] p-5 sm:flex-col sm:items-start sm:rounded-[10px_10px_10px_36px] sm:p-[22px_26px] ${metricVariants[variant]}`}>
    <strong className="min-w-0 max-w-full wrap-anywhere font-heading text-[clamp(36px,4vw,62px)] leading-none font-extrabold tracking-[-0.05em]">{value}</strong>
    <span className="min-w-0 text-base font-semibold sm:text-[17px]">{label}</span>
  </div>
)

const Donut = ({ active, expired }: { active: number; expired: number }) => {
  const total = active + expired
  const activePercent = total ? (active / total) * 100 : 0

  return (
    <div
      className="relative mx-auto mt-6 mb-4 grid size-40 shrink-0 place-items-center rounded-full after:size-28 after:rounded-full after:bg-surface after:content-[''] sm:size-[190px] sm:after:size-[132px]"
      role="img"
      aria-label={`${active} active and ${expired} expired warranties`}
      style={{ background: total ? `conic-gradient(var(--blue) 0 ${activePercent}%, var(--red) ${activePercent}% 100%)` : 'var(--line)' }}
    >
      <span className="absolute z-1 max-w-[65%] wrap-anywhere text-center font-heading text-3xl leading-none font-extrabold">{total}</span>
    </div>
  )
}

const UserDashboardView = ({ data }: { data: UserDashboard }) => {
  const maxDays = Math.max(...data.active_warranties.map(item => item.days_remaining), 1)
  const nextWarranty = data.active_warranties[0]

  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <MetricCard value={data.summary.total_warranties} label="Total warranties" variant="total" />
        <MetricCard value={data.summary.active} label="Active" variant="active" />
        <MetricCard value={data.summary.expired} label="Expired" variant="expired" />
      </div>

      <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section className={panelClass}>
          <h2 className="m-0 font-heading text-[21px] leading-[1.2] font-bold tracking-[-0.01em]">How long each warranty has left</h2>
          <p className="mt-1 mb-0 text-sm text-muted">
            {data.summary.active > 6 ? 'Your next six active warranties' : 'Active warranties'}, soonest to end first.
          </p>
          {data.active_warranties.length ? (
            <div className="mt-[26px] grid gap-[17px]">
              {data.active_warranties.map(warranty => (
                <div className="grid min-w-0 grid-cols-1 items-center gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]" key={warranty.warranty_id}>
                  <strong className="overflow-hidden text-sm text-ellipsis whitespace-nowrap" title={warranty.product_name}>{warranty.product_name}</strong>
                  <div className="h-[27px] [background-image:repeating-linear-gradient(to_right,transparent_0,transparent_calc(25%_-_1px),var(--line)_25%)]">
                    <span
                      className="relative block h-full min-w-2.5 rounded-r-sm bg-brand [background-image:repeating-linear-gradient(135deg,rgb(239_226_186_/_15%)_0_6px,transparent_6px_12px)]"
                      style={{ width: `${Math.max(12, warranty.days_remaining / maxDays * 100)}%` }}
                    >
                      <i className="absolute inset-y-0 right-0 w-1.5 rounded-r-sm bg-gold" />
                    </span>
                  </div>
                  <small className="text-xs text-muted sm:col-start-2">{formatDate(warranty.expires_on)} · {formatTimeLeft(warranty.days_remaining)}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-10 text-center text-muted">Nothing is covered right now. Add a warranty to start tracking.</p>
          )}
          {data.summary.expired > 0 && (
            <p className="mt-6 mb-0 text-sm text-muted">
              {data.summary.expired} expired {data.summary.expired === 1 ? 'warranty is' : 'warranties are'} not shown.{' '}
              <Link className="font-semibold" to="/warranty-history">See them in history</Link>
            </p>
          )}
        </section>

        <section className={`${panelClass} flex flex-col`}>
          <h2 className="m-0 font-heading text-[21px] leading-[1.2] font-bold tracking-[-0.01em]">Active vs expired</h2>
          <Donut active={data.summary.active} expired={data.summary.expired} />
          <div className="flex flex-wrap justify-center gap-5 text-sm font-medium">
            <span><i className="mr-1.5 inline-block size-[11px] rounded-[3px] bg-brand" />Active {data.summary.active}</span>
            <span><i className="mr-1.5 inline-block size-[11px] rounded-[3px] bg-alert" />Expired {data.summary.expired}</span>
          </div>
          {nextWarranty && (
            <div className="mt-5 rounded-[4px_10px_10px_4px] border-l-[6px] border-gold bg-cream px-4 py-3.5 text-ink xl:mt-auto xl:translate-y-1.5">
              <small className="block">Next to end</small>
              <strong className="block font-heading text-[17px] leading-tight font-bold">{nextWarranty.product_name}</strong>
              <span className="mt-1 block text-sm">{formatDate(nextWarranty.expires_on)} · {formatTimeLeft(nextWarranty.days_remaining)}</span>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

const AdminDashboardView = ({ data }: { data: AdminDashboard }) => {
  const maxCount = Math.max(...data.expiries_by_month.map(month => month.count), 1)
  const topMaximum = Math.max(...data.top_users.map(person => person.total), 1)
  const upcoming = data.expiries_by_month
    .filter(month => month.period !== 'past')
    .slice(0, 6)
    .reduce((total, month) => total + month.active_count, 0)

  return (
    <>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <MetricCard value={data.summary.users} label="Users" variant="total" />
        <MetricCard value={data.summary.total_warranties} label="Warranties" variant="gold" />
        <MetricCard value={data.summary.active} label="Active" variant="active" />
        <MetricCard value={data.summary.expired} label="Expired" variant="expired" />
      </div>

      <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <section className={panelClass}>
          <h2 className="m-0 font-heading text-[21px] leading-[1.2] font-bold tracking-[-0.01em]">Warranties ending each month</h2>
          <p className="mt-1 mb-0 text-sm text-muted">{upcoming} will end in the next 6 months. Red bars show past months; the dashed line marks this month.</p>
          <div className="mt-6 overflow-x-auto pb-2" role="region" aria-label="Monthly warranty expiries chart" tabIndex={0}>
            <div
              className="flex h-[250px] min-w-[32rem] items-end gap-1.5"
              role="img"
              aria-label={`Warranty expiries by month: ${data.expiries_by_month.map(month => `${month.month}: ${month.count}`).join(', ')}`}
            >
              {data.expiries_by_month.map(month => (
                <div
                  className={`flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1 ${month.period === 'current' ? 'border-l-2 border-dashed border-ink pl-1' : ''}`}
                  key={month.month}
                >
                  <strong className="font-heading text-sm leading-none font-bold">{month.count}</strong>
                  <span
                    className={`w-full max-w-[46px] rounded-t-sm border-t-[6px] ${month.period === 'past' ? 'border-alert bg-alert opacity-80' : 'border-gold bg-brand'}`}
                    style={{ height: `${Math.max(4, month.count / maxCount * 170)}px` }}
                  />
                  <small className="w-full border-t-2 border-ink pt-1 text-center text-[11px] text-muted">{month.label}{month.month.endsWith('-01') ? ` ’${month.month.slice(2, 4)}` : ''}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${panelClass} flex flex-col`}>
          <h2 className="m-0 font-heading text-[21px] leading-[1.2] font-bold tracking-[-0.01em]">Active vs expired</h2>
          <Donut active={data.summary.active} expired={data.summary.expired} />
          <div className="flex flex-wrap justify-center gap-5 text-sm font-medium">
            <span><i className="mr-1.5 inline-block size-[11px] rounded-[3px] bg-brand" />Active {data.summary.active}</span>
            <span><i className="mr-1.5 inline-block size-[11px] rounded-[3px] bg-alert" />Expired {data.summary.expired}</span>
          </div>
          <div className="mt-5 rounded-[4px_10px_10px_4px] border-l-[6px] border-gold bg-cream px-4 py-3.5 text-ink xl:mt-auto xl:translate-y-1.5">
            <strong className="block font-heading text-[17px] leading-tight font-bold">Your own warranties</strong>
            <span className="mt-1 block text-sm">{data.own_summary.active} active of {data.own_summary.total_warranties}.{' '}
              <Link className="font-semibold" to="/admin-history">See them</Link>
            </span>
          </div>
        </section>
      </div>

      <section className={`${panelClass} mt-5`}>
        <h2 className="m-0 font-heading text-[21px] leading-[1.2] font-bold tracking-[-0.01em]">Who holds the most warranties</h2>
        <p className="mt-1 mb-0 text-sm text-muted">The six users with the most. <Link className="font-semibold" to="/users">See all users</Link></p>
        <div className="mt-[18px] grid gap-4">
          {data.top_users.map(person => (
            <div className="grid min-w-0 grid-cols-1 items-center gap-x-3.5 gap-y-1.5 sm:grid-cols-[minmax(0,150px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,150px)_minmax(0,1fr)_minmax(0,170px)]" key={person.user_id}>
              <strong className="overflow-hidden text-ellipsis whitespace-nowrap">{person.name}</strong>
              <div className="min-w-0">
                <div className="flex h-[22px] min-w-1 overflow-hidden rounded-sm" style={{ width: `${Math.max(4, person.total / topMaximum * 100)}%` }}>
                  <span className="bg-brand" style={{ flex: person.active }} />
                  <span className="bg-alert" style={{ flex: person.expired }} />
                </div>
              </div>
              <small className="text-muted sm:col-start-2 xl:col-start-auto">{person.active} active, {person.expired} expired</small>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

const DashboardPage = ({ user }: DashboardPageProps) => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    getDashboard(user.token)
      .then(result => { if (!ignore) setData(result) })
      .catch((error: unknown) => { if (!ignore) setError(getErrorMessage(error)) })
    return () => { ignore = true }
  }, [user.token])

  return (
    <div>
      <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-[30px] sm:flex-row sm:flex-wrap sm:items-end sm:gap-5">
        <div className="min-w-0">
          <h1 className="m-0 font-heading text-[clamp(36px,5vw,54px)] leading-[0.98] font-extrabold tracking-[-0.04em]">Dashboard</h1>
          <p className="mt-2.5 mb-0 text-muted">{user.role === 'admin'
            ? `Everything across your WarrantyKeep workspace, ${user.name.split(' ')[0]}.`
            : `A clear view of what is covered and what needs your attention, ${user.name.split(' ')[0]}.`}
          </p>
        </div>
        <Link to="/add-warranty" className="inline-flex min-h-[46px] w-full shrink-0 items-center justify-center rounded-lg border-[1.5px] border-transparent bg-gold px-5 py-2.5 font-semibold text-[#1d2552] no-underline hover:brightness-105 sm:w-auto">+ Add warranty</Link>
      </header>

      {error && <div className="mb-[18px] rounded-[5px_9px_9px_5px] border-[1.5px] border-line border-l-[5px] border-l-alert bg-surface px-4 py-3 font-medium text-expired-text" role="alert">{error}</div>}
      {!data && !error && <div className="px-6 py-10 text-center text-muted">Loading your dashboard…</div>}
      {data?.role === 'admin' && <AdminDashboardView data={data} />}
      {data?.role === 'user' && <UserDashboardView data={data} />}
    </div>
  )
}

export default DashboardPage
