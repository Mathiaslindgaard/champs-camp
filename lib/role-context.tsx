'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Role } from './types'

const ROLES: Role[] = ['admin', 'trainer', 'volunteer', 'member']

const ROLE_LABELS: Record<Role, string> = {
  admin:     'ADMIN',
  trainer:   'TRÆNER',
  volunteer: 'FRIVILLIG',
  member:    'MEDLEM',
}

const ROLE_RANK: Record<Role, number> = {
  member: 0, volunteer: 1, trainer: 2, admin: 3,
}

interface RoleContextValue {
  role: Role
  roleLabel: string
  cycleRole: () => void
  isAtLeast: (min: Role) => boolean
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [idx, setIdx] = useState(0)
  const role = ROLES[idx]

  function cycleRole() {
    setIdx(i => (i + 1) % ROLES.length)
  }

  function isAtLeast(min: Role): boolean {
    return ROLE_RANK[role] >= ROLE_RANK[min]
  }

  return (
    <RoleContext.Provider value={{ role, roleLabel: ROLE_LABELS[role], cycleRole, isAtLeast }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
