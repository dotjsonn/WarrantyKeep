export type ManagedUser = {
  user_id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  warranty_count: number;
}

export type UsersPageResult = {
  items: ManagedUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
