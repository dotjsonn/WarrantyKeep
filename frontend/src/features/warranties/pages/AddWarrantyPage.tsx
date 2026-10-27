import { useState, type SubmitEvent } from 'react'
import { getErrorMessage } from '../../../utils/errors'
import WarrantyForm from '../components/WarrantyForm'
import { createWarranty } from '../services/warrantyService'
import { createWarrantyFormValues, toWarrantyRequest } from '../utils/warrantyForm'

const AddWarrantyPage = () => {
  const [formValues, setFormValues] = useState(createWarrantyFormValues)
  const [message, setMessage] = useState<string | null>(null)
  const [messageIsError, setMessageIsError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setMessage(null)
    setSubmitting(true)

    try {
      const warranty = await createWarranty(toWarrantyRequest(formValues))
      setFormValues(createWarrantyFormValues())
      setMessageIsError(false)
      setMessage(`Warranty created for ${warranty.name}`)
    } catch (error: unknown) {
      setMessageIsError(true)
      setMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-5 sm:mb-[30px]">
        <div className="min-w-0">
          <h1 className="m-0 font-heading text-[clamp(36px,5vw,54px)] leading-[0.98] font-extrabold tracking-[-0.04em]">Add warranty</h1>
          <p className="mt-2.5 mb-0 text-muted">Enter what is on your receipt. We will work out when coverage ends.</p>
        </div>
      </header>
      {message && (
        <p
          role={messageIsError ? 'alert' : 'status'}
          className={`mb-[18px] rounded-[5px_9px_9px_5px] border-[1.5px] border-line border-l-[5px] bg-surface px-4 py-3 font-medium ${messageIsError ? 'border-l-alert text-expired-text' : 'border-l-brand'}`}
        >
          {message}
        </p>
      )}
      <WarrantyForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  )
}

export default AddWarrantyPage
