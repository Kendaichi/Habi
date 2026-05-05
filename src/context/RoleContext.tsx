"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "buyer" | "artisan" | "supplier" | "junkshop"

interface RoleContextType {
  role: UserRole | null
  setRole: (role: UserRole | null) => void
}

const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
})

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("habi_role") as UserRole | null
    if (stored) setRoleState(stored)
  }, [])

  const setRole = (newRole: UserRole | null) => {
    if (newRole) {
      localStorage.setItem("habi_role", newRole)
    } else {
      localStorage.removeItem("habi_role")
    }
    setRoleState(newRole)
  }

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export const useRole = () => useContext(RoleContext)
