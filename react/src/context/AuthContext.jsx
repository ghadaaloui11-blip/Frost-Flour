// Keeps the logged-in user for the whole app.
// Any component can do: const { user, login, logout } = useAuth()
import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On page load, ask the API who is logged in (the cookie is sent automatically).
  useEffect(() => {
    authApi
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { user } = await authApi.login(email, password)
    setUser(user)
    return user
  }

  async function register(data) {
    const { user } = await authApi.register(data)
    setUser(user)
    return user
  }

  async function logout() {
    await authApi.logout().catch(() => {})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
