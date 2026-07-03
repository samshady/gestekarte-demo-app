'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/lib/language'
import { TrendingUp, Users, Clock, Ban, AlertTriangle } from 'lucide-react'

export function StatsCards({
  total,
  pending,
  active,
  deactivated,
  rejected,
}: {
  total: number
  pending: number
  active: number
  deactivated: number
  rejected: number
}) {
  const { t } = useLanguage()

  const stats = [
    { label: t('Gaste gesamt', 'Total'), value: total, color: '#252C27', bg: '#f0f1ee', icon: TrendingUp },
    { label: t('Ausstehende Genehmigungen', 'Pending'), value: pending, color: '#f5a623', bg: '#fef7ed', icon: Clock },
    { label: t('Aktive Gaste', 'Active'), value: active, color: '#9FBF47', bg: '#f4f8ed', icon: Users },
    { label: t('Deaktiviert', 'Deactivated'), value: deactivated, color: '#928781', bg: '#f3f2f0', icon: Ban },
    { label: t('Abgelehnt', 'Rejected'), value: rejected, color: '#6B5242', bg: '#f0ebe7', icon: AlertTriangle },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-5">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <Card key={s.label} className="border-0 shadow-sm text-center" style={{ backgroundColor: s.bg }}>
            <CardContent className="flex flex-col items-center gap-1 py-4 px-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: s.color + '20' }}>
                <Icon className="h-5 w-5" style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-bold leading-tight" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-medium text-center leading-snug break-words max-w-full" style={{ color: '#5a5a5a' }}>{s.label}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
