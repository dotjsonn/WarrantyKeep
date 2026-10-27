type WarrantySummary = {
  total_warranties: number;
  active: number;
  expired: number;
}

export type UserDashboard = {
  role: 'user';
  summary: WarrantySummary;
  active_warranties: Array<{
    warranty_id: string;
    product_name: string;
    expires_on: string;
    days_remaining: number;
  }>;
}

export type AdminDashboard = {
  role: 'admin';
  summary: WarrantySummary & { users: number };
  own_summary: WarrantySummary;
  expiries_by_month: Array<{
    month: string;
    label: string;
    period: 'past' | 'current' | 'future';
    count: number;
    active_count: number;
  }>;
  top_users: Array<{
    user_id: string;
    name: string;
    total: number;
    active: number;
    expired: number;
  }>;
}

export type DashboardData = UserDashboard | AdminDashboard
