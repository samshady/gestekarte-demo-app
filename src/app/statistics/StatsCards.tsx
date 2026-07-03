'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/lib/language'
import { TrendingUp, Users, Clock, Ban, CalendarX, AlertTriangle, MailQuestion } from 'lucide-react'

const iconMap = [TrendingUp, Clock, Users, Ban, CalendarX, AlertTriangle, MailQuestion]

export function StatsCards({
  total,
  pending,
  active,
  deactivated,
  expired,
  rejected,
  invited,
}: {
  total: number
  pending: number
  active: number
  deactivated: number
  expired: number
  rejected: number
  invited: number
}) {
  const { t } = useLanguage()

  const stats = [
    { label: t('Gäste gesamt', 'Total'), value: total, color: '#252C27', bg: '#f0f1ee' },
    { label: t('Ausstehend', 'Pending'), value: pending, color: '#f5a623', bg: '#fef7ed' },
    { label: t('Aktiv', 'Active'), value: active, color: '#9FBF47', bg: '#f4f8ed' },
    { label: t('Deaktiviert', 'Deactivated'), value: deactivated, color: '#928781', bg: '#f3f2f0' },
    { label: t('Abgelaufen', 'Expired'), value: expired, color: '#e74c3c', bg: '#fdedec' },
    { label: t('Abgelehnt', 'Rejected'), value: rejected, color: '#6B5242', bg: '#f0ebe7' },
    { label: t('Eingeladen', 'Invited'), value: invited, color: '#295A97', bg: '#eef3fa' },
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
      {stats.map((s, i) => {
        const Icon = iconMap[i]
        return (
          <Card key={s.label} className="border-0 shadow-sm text-center" style={{ backgroundColor: s.bg }}>
            <CardContent className="flex flex-col items-center gap-1 py-3 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: s.color + '20' }}>
                <Icon className="h-4 w-4" style={{ color: s.color }} />
              </div>
              <p className="text-xl font-bold leading-tight" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-medium text-center leading-snug break-words max-w-full" style={{ color: '#5a5a5a' }}>{s.label}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
