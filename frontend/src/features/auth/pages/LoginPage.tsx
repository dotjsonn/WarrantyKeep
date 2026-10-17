import type { LoginProps } from "../types/auth.types"

const LoginPage = ({email, password, handleEmail, handlePassword, handleSubmit}: LoginProps) => {
  return (
    <div>
      <h1 className="text-2xl">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="my-2">
          <label className="text-lg">
            Email:
            <input className="border-2 p-1 pl-2 rounded-md text-sm ml-2"  
              type="email" value={email} onChange={handleEmail} 
            />
          </label>
        </div>
        <div className="my-2">
          <label className="text-lg">
            Password:
            <input className="border-2 p-1 pl-2 rounded-md text-sm ml-2"
              type="password" value={password} onChange={handlePassword} 
            />
          </label>
        </div>
        <button className="border-2 py-2 px-24 rounded-4xl bg-gray-900 text-white"
          type="submit">
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage