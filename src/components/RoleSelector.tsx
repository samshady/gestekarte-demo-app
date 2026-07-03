'use client'

import { useRole, type Role } from '@/lib/role'

const roles: { value: Role; label: string }[] = [
  { value: 'ROLE_HOST', label: 'Host' },
  { value: 'ROLE_ITZ', label: 'ITZ' },
  { value: 'ROLE_IO', label: 'IO' },
  { value: 'ROLE_ULB', label: 'ULB' },
]

export function RoleSelector() {
  const { role, setRole } = useRole()

  return (
    <div className="flex items-center gap-1.5 rounded border px-2 py-1" style={{ borderColor: '#d0d3cc', fontSize: '0.75em' }}>
      <span style={{ color: '#928781', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        Rolle
      </span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="rounded border-0 bg-transparent text-xs font-semibold outline-none"
        style={{ color: '#295A97' }}
      >
        {roles.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
    </div>
  )
}
