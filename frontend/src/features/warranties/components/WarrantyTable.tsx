import type { User } from '../../auth/types/auth.types'
import type { Warranty } from '../types/warranties.types'

type WarrantyTableProps = {
  warranties: Warranty[];
  role: User['role'];
  userId: string;
  onEdit: (warranty: Warranty) => void;
  onDelete: (warranty: Warranty) => Promise<void>;
}

const WarrantyTable = ({ warranties, role, userId, onEdit, onDelete }: WarrantyTableProps) => {
  if (warranties.length === 0) return <p className="mt-4">No warranties found.</p>

  const isAdmin = role === 'admin'

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            {isAdmin && <th className="border p-2">Owner</th>}
            <th className="border p-2">Product</th>
            <th className="border p-2">Purchase Date</th>
            <th className="border p-2">Months</th>
            <th className="border p-2">Expires On</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Receipt</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {warranties.map(warranty => (
            <tr key={warranty.warranty_id}>
              {isAdmin && (
                <td className="border p-2">
                  <div>{warranty.user_name}</div>
                  <div className="text-sm">{warranty.user_email}</div>
                </td>
              )}
              <td className="border p-2">{warranty.product_name}</td>
              <td className="border p-2">{warranty.purchase_date}</td>
              <td className="border p-2">{warranty.warranty_months}</td>
              <td className="border p-2">{warranty.expires_on}</td>
              <td className="border p-2">{warranty.status}</td>
              <td className="border p-2">{warranty.receipt_url || 'None'}</td>
              <td className="border p-2">
                <div className="flex gap-2">
                  {warranty.user_id === userId && (
                    <button
                      className="rounded border px-3 py-1"
                      type="button"
                      onClick={() => onEdit(warranty)}
                    >
                      Edit
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      className="rounded border px-3 py-1 text-red-600"
                      type="button"
                      onClick={() => onDelete(warranty)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WarrantyTable
