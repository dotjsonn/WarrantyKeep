import { useEffect, useRef, useState, type SubmitEvent } from 'react'
import { getErrorMessage } from '../../../utils/errors'
import { updateWarranty } from '../services/warrantyService'
import type { Warranty } from '../types/warranties.types'
import { createWarrantyFormValues, toWarrantyRequest } from '../utils/warrantyForm'
import WarrantyForm from './WarrantyForm'

type EditWarrantyModalProps = {
  warranty: Warranty;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

const EditWarrantyModal = ({ warranty, onClose, onSaved }: EditWarrantyModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [formValues, setFormValues] = useState(() => createWarrantyFormValues(warranty))
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const modal = dialogRef.current
    modal?.showModal()
    return () => modal?.close()
  }, [])

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    try {
      await updateWarranty(warranty.warranty_id, toWarrantyRequest(formValues))
      await onSaved()
      onClose()
    } catch (error: unknown) {
      setMessage(getErrorMessage(error))
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      aria-labelledby="edit-warranty-title"
      className="m-auto max-h-screen overflow-y-auto rounded border bg-white p-4 backdrop:bg-black/50"
    >
      <h2 id="edit-warranty-title" className="text-xl font-bold">Edit Warranty</h2>
      {message && <p role="alert" className="mt-2 text-red-600">{message}</p>}
      <WarrantyForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
      <button className="rounded border px-4 py-2" type="button" onClick={onClose}>
        Cancel
      </button>
    </dialog>
  )
}

export default EditWarrantyModal
