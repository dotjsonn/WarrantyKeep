import type { SubmitEvent } from 'react'
import type { WarrantyFormValues } from '../types/warranties.types'
import { getTodayInManila, getWarrantyEndDate } from '../utils/warrantyDates'

type WarrantyFormProps = {
  values: WarrantyFormValues;
  onChange: (values: WarrantyFormValues) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  submitLabel?: string;
  submitting?: boolean;
}

const inputClass = 'h-[54px] min-w-0 w-full max-w-full rounded-lg border-[1.5px] border-line bg-page px-3 font-normal focus:border-brand focus:outline-none focus:shadow-[0_0_0_3px_rgb(64_86_161_/_14%)] sm:px-4'

const WarrantyForm = ({
  values,
  onChange,
  onSubmit,
  submitLabel = 'Add warranty',
  submitting = false
}: WarrantyFormProps) => {
  const getCoverageEnd = () => {
    const end = getWarrantyEndDate(values.purchaseDate, Number(values.warrantyMonths))
    if (!end) return null
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric'
    }).format(new Date(`${end}T00:00:00Z`))
  }

  const coverageEnd = getCoverageEnd()

  return (
      <form className="grid min-w-0 grid-cols-1 gap-5 rounded-[10px] border-[1.5px] border-line bg-surface p-4 sm:p-6 md:grid-cols-2 md:gap-x-7 md:gap-y-7 xl:p-10" onSubmit={onSubmit} aria-busy={submitting}>
        <div className="min-w-0">
          <label className="flex flex-col gap-2 font-semibold">
            Product name
            <input
              className={inputClass}
              type="text"
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              value={values.productName}
              onChange={({ target }) => onChange({ ...values, productName: target.value })}
              required
              maxLength={255}
            />
          </label>
        </div>
        <div className="min-w-0">
          <label className="flex flex-col gap-2 font-semibold">
            Purchase date
            <input
              className={inputClass}
              type="date"
              min="1900-01-01"
              max={getTodayInManila()}
              value={values.purchaseDate}
              onChange={({ target }) => onChange({ ...values, purchaseDate: target.value })}
              required
            />
          </label>
        </div>
        <div className="min-w-0">
          <label className="flex flex-col gap-2 font-semibold">
            Warranty length (months)
            <input
              className={inputClass}
              type="number"
              placeholder="12"
              value={values.warrantyMonths}
              onChange={({ target }) => onChange({ ...values, warrantyMonths: target.value })}
              required
              min={1}
              max={120}
              step={1}
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-2" aria-label="Common warranty lengths">
            {[12, 24, 36, 60].map(months => (
              <button
                className="min-h-11 cursor-pointer rounded-full border-[1.5px] border-line bg-transparent px-3 py-1 text-[13px] font-medium hover:border-brand"
                key={months}
                type="button"
                onClick={() => onChange({ ...values, warrantyMonths: String(months) })}
              >
                {months} months
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <label className="flex flex-col gap-2 font-semibold">
            <span>Receipt link <span className="font-normal text-muted">(optional)</span></span>
            <input
              className={inputClass}
              type="url"
              placeholder="https://…"
              pattern="https://.*"
              title="Enter a secure URL beginning with https://"
              maxLength={2048}
              value={values.receiptUrl}
              onChange={({ target }) => onChange({ ...values, receiptUrl: target.value })}
            />
          </label>
          <small className="mt-2 block text-muted">Link to a hosted receipt image or PDF.</small>
        </div>
        <div className="col-span-full min-w-0 wrap-anywhere rounded-[10px_10px_10px_28px] bg-cream px-4 py-5 text-ink sm:px-[26px]">
          <strong className="block font-heading text-xl leading-[1.3] font-bold">{coverageEnd ? `Coverage ends ${coverageEnd}` : 'Coverage end date'}</strong>
          <small className="mt-0.5 block opacity-80">{coverageEnd ? 'We will keep this date easy to find.' : 'Fill in the purchase date and length to see it.'}</small>
        </div>
        <div className="col-span-full flex justify-end border-t-[1.5px] border-line pt-6">
          <button
            className="inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-transparent bg-brand px-5 py-2.5 font-semibold text-white hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : submitLabel}
          </button>
        </div>
      </form>
  )
}

export default WarrantyForm
