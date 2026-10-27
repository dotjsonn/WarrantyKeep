export type LoginRequest = {
  email: string;
  password: string;
}

export type User = {
  token: string;
  user_id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
}