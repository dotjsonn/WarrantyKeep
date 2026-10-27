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
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const modal = dialogRef.current
    modal?.showModal()
    return () => modal?.close()
  }, [])

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setMessage(null)
    setSubmitting(true)

    try {
      await updateWarranty(warranty.warranty_id, toWarrantyRequest(formValues))
      await onSaved()
      onClose()
    } catch (error: unknown) {
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      aria-labelledby="edit-warranty-title"
      className="m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-[850px] overflow-y-auto overscroll-contain rounded-xl border-[1.5px] border-line bg-page p-4 wrap-anywhere text-ink backdrop:bg-[#141932a6] backdrop:backdrop-blur-[3px] sm:p-[26px]"
    >
      <div className="mb-5 flex items-start justify-between gap-3 sm:gap-5">
        <div className="min-w-0">
          <h2 className="m-0 font-heading text-[28px] leading-[1.2] font-bold" id="edit-warranty-title">Edit warranty</h2>
          <p className="mt-1 mb-0 line-clamp-2 text-muted" title={warranty.product_name}>Update the details for {warranty.product_name}.</p>
        </div>
        <button type="button" className="size-11 shrink-0 cursor-pointer rounded-lg border-[1.5px] border-line bg-transparent text-2xl leading-none" onClick={onClose} aria-label="Close">×</button>
      </div>
      {message && <p role="alert" className="mb-[18px] rounded-[5px_9px_9px_5px] border-[1.5px] border-line border-l-[5px] border-l-alert bg-surface px-4 py-3 font-medium text-expired-text">{message}</p>}
      <WarrantyForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        submitting={submitting}
      />
      <button className="mt-3 inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-line bg-transparent px-5 py-2.5 font-semibold text-ink hover:brightness-105 sm:w-auto" type="button" onClick={onClose}>
        Cancel
      </button>
    </dialog>
  )
}

export default EditWarrantyModal
