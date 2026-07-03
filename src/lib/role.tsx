'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Role = 'ROLE_HOST' | 'ROLE_ITZ' | 'ROLE_IO' | 'ROLE_ULB'

interface RoleContextValue {
  role: Role
  setRole: (role: Role) => void
}

const RoleContext = createContext<RoleContextValue>({
  role: 'ROLE_HOST',
  setRole: () => {},
})

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('ROLE_HOST')
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
