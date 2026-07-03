'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useRole } from '@/lib/role'

export function NavLinks() {
  const { t } = useLanguage()
  const { role } = useRole()
  const linkStyle = {
    color: '#5a5a5a' as const,
    transition: 'color 0.15s',
    fontSize: '0.75em',
    fontWeight: 700 as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.03em',
  }

  return (
    <nav className="flex items-center gap-3 text-sm whitespace-nowrap">
      {/* Guest section */}
      <span style={{ color: '#BBB5A9', fontSize: '0.7em', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {t('Gast', 'Guest')}
      </span>
      <Link
        href="/apply"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#9FBF47')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a5a')}
      >
        {t('Antrag', 'Apply')}
      </Link>
      <Link
        href="/status"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#9FBF47')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a5a')}
      >
        {t('Status', 'Status')}
      </Link>
      <Link
        href="/contact"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#9FBF47')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a5a')}
      >
        {t('Kontakt', 'Contact')}
      </Link>

      {/* Divider */}
      <div className="h-5 w-px" style={{ backgroundColor: '#BBB5A9' }} />

      {/* Admin section - role-dependent */}
      <span style={{ color: '#BBB5A9', fontSize: '0.7em', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {role === 'ROLE_HOST' ? 'Host' : role === 'ROLE_ITZ' ? 'ITZ' : role === 'ROLE_IO' ? 'IO' : 'ULB'}
      </span>

      {/* All admin roles see dashboard */}
      <Link
        href={role === 'ROLE_HOST' ? '/dashboard?host=Prof.+Dr.+Thomas+Weber' : '/dashboard'}
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#9FBF47')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a5a')}
      >
        Dashboard
      </Link>

      {/* Host: invite */}
      {role === 'ROLE_HOST' && (
        <Link
          href="/invite"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#9FBF47')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a5a')}
        >
          {t('Einladen', 'Invite')}
        </Link>
      )}

      {/* ITZ: admin */}
      {role === 'ROLE_ITZ' && (
        <Link
          href="/admin"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#9FBF47')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a5a')}
        >
          Admin
        </Link>
      )}

      {/* IO, ULB: statistics (not for Host) */}
      {role !== 'ROLE_ITZ' && role !== 'ROLE_HOST' && (
        <Link
          href="/statistics"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#9FBF47')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a5a')}
        >
          {t('Statistiken', 'Statistics')}
        </Link>
      )}

      {/* ULB: library admin */}
      {role === 'ROLE_ULB' && (
        <Link
          href="/ulb-admin"
          style={linkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#9FBF47')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#5a5a5a')}
        >
          {t('Bibliothek', 'Library')}
        </Link>
      )}
    </nav>
  )
}
