import { useState } from 'react'
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

const WarrantyHistory = ({ user, title, scope }: WarrantyHistoryProps) => {
  const { warranties, loading, error, refreshWarranties } = useWarranties()
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const statusMessage = message ?? error

  const visibleWarranties = warranties.filter(warranty => {
    return scope === 'own'
      ? warranty.user_id === user.user_id
      : warranty.user_id !== user.user_id
  })

  const handleSaved = async () => {
    await refreshWarranties()
    setMessage('Warranty updated')
  }

  const handleDelete = async (warranty: Warranty) => {
    if (user.role !== 'admin') return
    if (!window.confirm(`Delete warranty for ${warranty.product_name}?`)) return

    try {
      await removeWarranty(warranty.warranty_id)
      await refreshWarranties()
      setMessage('Warranty deleted')
    } catch (error: unknown) {
      setMessage(getErrorMessage(error))
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      {statusMessage && <p role="status" className="mt-4">{statusMessage}</p>}
      {loading && <p className="mt-4">Loading warranties...</p>}
      {!loading && (
        <WarrantyTable
          warranties={visibleWarranties}
          role={user.role}
          userId={user.user_id}
          onEdit={setEditingWarranty}
          onDelete={handleDelete}
        />
      )}

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
