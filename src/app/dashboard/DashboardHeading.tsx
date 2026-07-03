'use client'

import { useLanguage } from '@/lib/language'
import { useRole } from '@/lib/role'

export function DashboardHeading({ hostFilter }: { hostFilter?: string }) {
  const { t } = useLanguage()
  const { role } = useRole()

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
        {t('Dashboard', 'Dashboard')}
      </h1>
      <p className="mt-1 text-sm" style={{ color: '#928781' }}>
        {hostFilter
          ? t(
              `Gaste von ${hostFilter}`,
              `Guests of ${hostFilter}`
            )
          : role === 'ROLE_HOST'
          ? t('Ihre eingeladenen Gaste', 'Your invited guests')
          : t('Verwaltung aller Gastekartenantrage', 'Manage all guest card applications')}
      </p>
    </div>
  )
}
