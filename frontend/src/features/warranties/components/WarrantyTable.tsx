import type { User } from '../../auth/types/auth.types'
import type { Warranty } from '../types/warranties.types'
import { getSafeExternalUrl } from '../../../utils/safeUrl'

type WarrantyTableProps = {
  warranties: Warranty[];
  role: User['role'];
  userId: string;
  onEdit: (warranty: Warranty) => void;
  onDelete: (warranty: Warranty) => Promise<void>;
}

const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric'
}).format(new Date(`${value}T00:00:00`))

const statusClasses = {
  active: 'bg-active-bg text-active-text before:rounded-full before:bg-brand',
  expired: 'bg-expired-bg text-expired-text before:rotate-45 before:rounded-sm before:bg-alert'
} as const

const ReceiptLink = ({ value }: { value: string | null }) => {
  const safeUrl = getSafeExternalUrl(value)
  return safeUrl
    ? <a className="inline-flex min-h-11 items-center font-semibold whitespace-nowrap" href={safeUrl} target="_blank" rel="noopener noreferrer">View receipt</a>
    : <span className="text-muted">None</span>
}

const WarrantyStatus = ({ status }: { status: Warranty['status'] }) => (
  <span className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-[13px] font-semibold whitespace-nowrap capitalize before:size-2 before:content-[''] ${statusClasses[status]}`}>{status}</span>
)

const WarrantyTable = ({ warranties, role, userId, onEdit, onDelete }: WarrantyTableProps) => {
  if (warranties.length === 0) {
    return <p className="px-6 py-10 text-center text-muted">No warranties match. Clear the search or switch the filter.</p>
  }

  const isAdmin = role === 'admin'
  const renderActions = (warranty: Warranty) => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 whitespace-nowrap">
      {warranty.user_id === userId && (
        <button className="min-h-11 min-w-11 cursor-pointer border-0 bg-transparent px-1 font-semibold text-link underline" type="button" onClick={() => onEdit(warranty)}>Edit</button>
      )}
      {(isAdmin || warranty.user_id === userId) && (
        <button className="min-h-11 min-w-11 cursor-pointer border-0 bg-transparent px-1 font-semibold text-expired-text underline" type="button" onClick={() => onDelete(warranty)}>Delete</button>
      )}
    </div>
  )

  return (
    <>
      <ul className="m-0 grid list-none divide-y-[1.5px] divide-line p-0 lg:hidden" aria-label="Warranty history">
        {warranties.map(warranty => (
          <li className="min-w-0 p-4 sm:p-5" key={warranty.warranty_id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <strong className="min-w-0 flex-1 basis-36 wrap-anywhere">{warranty.product_name}</strong>
              <WarrantyStatus status={warranty.status} />
            </div>
            {isAdmin && (
              <div className="mt-3 min-w-0 wrap-anywhere text-sm">
                <span className="text-muted">Owner: </span><span className="font-medium">{warranty.user_name}</span>
                <span className="block text-muted">{warranty.user_email}</span>
              </div>
            )}
            <dl className="my-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div><dt className="text-muted">Purchased</dt><dd className="m-0 font-medium">{formatDate(warranty.purchase_date)}</dd></div>
              <div><dt className="text-muted">Coverage ends</dt><dd className="m-0 font-medium">{formatDate(warranty.expires_on)}</dd></div>
              <div><dt className="text-muted">Warranty length</dt><dd className="m-0 font-medium">{warranty.warranty_months} months</dd></div>
            </dl>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line pt-2 text-sm">
              {warranty.receipt_url ? <ReceiptLink value={warranty.receipt_url} /> : <span className="text-muted">No receipt</span>}
              {renderActions(warranty)}
            </div>
          </li>
        ))}
      </ul>
      <div className="relative hidden max-w-full overflow-x-auto lg:block" role="region" aria-label="Warranty history table" tabIndex={0}>
        <table className="w-full min-w-[820px] border-collapse text-left">
          <caption className="sr-only">Warranty purchases, expiry dates, status and available actions.</caption>
          <thead>
            <tr className="[&>th]:border-b-2 [&>th]:border-ink [&>th]:px-[18px] [&>th]:py-4 [&>th]:text-[13px] [&>th]:font-semibold [&>th]:tracking-[0.03em] [&>th]:text-muted [&>th]:uppercase">
              {isAdmin && <th>Owner</th>}<th>Product</th><th>Purchased</th><th>Length</th>
              <th>Ends</th><th>Status</th><th>Receipt</th><th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {warranties.map(warranty => (
              <tr className="hover:bg-[#c5cbe321] [&>td]:border-b-[1.5px] [&>td]:border-line [&>td]:px-[18px] [&>td]:py-4 [&>td]:align-middle last:[&>td]:border-b-0" key={warranty.warranty_id}>
                {isAdmin && (
                  <td className="min-w-40">
                    <strong className="wrap-anywhere">{warranty.user_name}</strong>
                    <small className="block max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap text-muted">{warranty.user_email}</small>
                  </td>
                )}
                <td className="min-w-40"><strong className="block max-w-64 wrap-anywhere">{warranty.product_name}</strong></td>
                <td className="whitespace-nowrap">{formatDate(warranty.purchase_date)}</td>
                <td className="whitespace-nowrap">{warranty.warranty_months} mo</td>
                <td className="whitespace-nowrap">{formatDate(warranty.expires_on)}</td>
                <td><WarrantyStatus status={warranty.status} /></td>
                <td><ReceiptLink value={warranty.receipt_url} /></td>
                <td>{renderActions(warranty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default WarrantyTable
