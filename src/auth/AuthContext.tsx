import React, { createContext, useContext, useMemo, useState } from 'react'

export type UserRole = 'SUPER_ADMIN' | 'HOSPITAL_ADMIN' | 'DOCTOR' | 'PATIENT'

export type Permission = 'READ' | 'DOWNLOAD'

export interface AuthUser {
  id: string
  name: string
  role: UserRole
  permissions?: Permission[]
}

interface AuthContextValue {
  user: AuthUser | null
  login: (role: UserRole, name?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)

  const login = (role: UserRole, name?: string) => {
    const base: AuthUser = { id: crypto.randomUUID(), name: name ?? role, role }
    // Mock permissions for demo
    if (role === 'DOCTOR') base.permissions = ['READ', 'DOWNLOAD']
    if (role === 'HOSPITAL_ADMIN') base.permissions = ['READ']
    if (role === 'PATIENT') base.permissions = ['READ', 'DOWNLOAD']
    setUser(base)
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


