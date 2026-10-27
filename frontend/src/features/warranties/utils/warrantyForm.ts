import type { Warranty, WarrantyFormValues, WarrantyRequest } from '../types/warranties.types'

export const createWarrantyFormValues = (warranty?: Warranty): WarrantyFormValues => ({
  productName: warranty?.product_name ?? '',
  purchaseDate: warranty?.purchase_date ?? '',
  warrantyMonths: warranty ? String(warranty.warranty_months) : '',
  receiptUrl: warranty?.receipt_url ?? ''
})

export const toWarrantyRequest = (values: WarrantyFormValues): WarrantyRequest => ({
  name: values.productName.trim(),
  purchase_date: values.purchaseDate,
  warranty_months: Number(values.warrantyMonths),
  receipt_url: values.receiptUrl.trim() || null
})
