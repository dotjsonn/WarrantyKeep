export type WarrantyRequest = {
  name: string;
  purchase_date: string;
  warranty_months: number;
  receipt_url: string | null;
}

export type WarrantyFormValues = {
  productName: string;
  purchaseDate: string;
  warrantyMonths: string;
  receiptUrl: string;
}

export type Warranty = {
  warranty_id: string;
  product_name: string;
  purchase_date: string;
  warranty_months: number;
  receipt_url: string | null;
  user_id: string;
  user_name: string;
  user_email: string;
  expires_on: string;
  status: 'active' | 'expired';
}

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export type WarrantyPage = {
  items: Warranty[];
  pagination: PaginationMeta;
  summary: {
    all: number;
    active: number;
    expired: number;
  };
}

export type WarrantyQuery = {
  page?: number;
  limit?: number;
  scope?: 'all' | 'own' | 'others';
  status?: 'all' | 'active' | 'expired';
  search?: string;
}
