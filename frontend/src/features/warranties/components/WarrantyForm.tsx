import type { SubmitEvent } from 'react'
import type { WarrantyFormValues } from '../types/warranties.types'

type WarrantyFormProps = {
  values: WarrantyFormValues;
  onChange: (values: WarrantyFormValues) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  submitLabel?: string;
}

const WarrantyForm = ({
  values,
  onChange,
  onSubmit,
  submitLabel = 'Add Warranty'
}: WarrantyFormProps) => {
  return (
    <div>
      <form className="my-4 max-w-md space-y-3 rounded border p-4" onSubmit={onSubmit}>
        <div>
          <label className="block">
            Product Name
            <input
              className="mt-1 block w-full rounded border p-2"
              type="text"
              value={values.productName}
              onChange={({ target }) => onChange({ ...values, productName: target.value })}
              required
              maxLength={255}
            />
          </label>
        </div>
        <div>
          <label className="block">
            Purchase Date
            <input
              className="mt-1 block w-full rounded border p-2"
              type="date"
              value={values.purchaseDate}
              onChange={({ target }) => onChange({ ...values, purchaseDate: target.value })}
              required
            />
          </label>
        </div>
        <div>
          <label className="block">
            Warranty Months
            <input
              className="mt-1 block w-full rounded border p-2"
              type="number"
              value={values.warrantyMonths}
              onChange={({ target }) => onChange({ ...values, warrantyMonths: target.value })}
              required
              min={1}
              max={120}
              step={1}
            />
          </label>
        </div>
        <div>
          <label className="block">
            Receipt Url
            <input
              className="mt-1 block w-full rounded border p-2"
              type="text"
              value={values.receiptUrl}
              onChange={({ target }) => onChange({ ...values, receiptUrl: target.value })}
            />
          </label>
        </div>
        <button className="rounded border bg-gray-900 px-4 py-2 text-white" type="submit">
          {submitLabel}
        </button>
      </form>
    </div>
  )
}

export default WarrantyForm
