import { ReactNode, useState } from 'react'

interface AdminAuthProps {
  children: ReactNode
}

export function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Replace with your actual admin password
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      alert('Invalid password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border p-2"
              placeholder="Enter admin password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  return <>{children}</>
} 