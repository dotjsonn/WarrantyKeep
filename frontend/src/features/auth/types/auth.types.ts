import type { SubmitEvent } from "react"

export type LoginRequest = {
  email: string,
  password: string
}

export type User = {
  token: string,
  user_id: string,
  name: string,
  email: string,
  role: 'user' | 'admin'
}

export type LoginProps = {
  email: string;
  password: string;
  handleEmail: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
}