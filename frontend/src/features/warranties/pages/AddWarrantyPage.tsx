import { useState, type SubmitEvent } from 'react'
import { getErrorMessage } from '../../../utils/errors'
import WarrantyForm from '../components/WarrantyForm'
import { createWarranty } from '../services/warrantyService'
import { createWarrantyFormValues, toWarrantyRequest } from '../utils/warrantyForm'

const AddWarrantyPage = () => {
  const [formValues, setFormValues] = useState(createWarrantyFormValues)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    try {
      const warranty = await createWarranty(toWarrantyRequest(formValues))
      setFormValues(createWarrantyFormValues())
      setMessage(`Warranty created for ${warranty.name}`)
    } catch (error: unknown) {
      setMessage(getErrorMessage(error))
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">Add Warranty</h2>
      {message && <p role="status" className="mt-4">{message}</p>}
      <WarrantyForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default AddWarrantyPage
