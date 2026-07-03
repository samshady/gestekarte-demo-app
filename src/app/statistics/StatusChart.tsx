'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/language'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts'

export function StatusChart({
  pending, active, deactivated, expired,   rejected,
  invited,
}: {
  pending: number; active: number; deactivated: number; expired: number; rejected: number; invited: number
}) {
  const { t } = useLanguage()

  const data = useMemo(() => {
    const raw = [
      { label: t('Ausstehend', 'Pending'), value: pending, color: '#f5a623', light: '#fef0d4' },
      { label: t('Aktiv', 'Active'), value: active, color: '#9FBF47', light: '#e2efc4' },
      { label: t('Deaktiviert', 'Deactivated'), value: deactivated, color: '#928781', light: '#d9d5d0' },
      { label: t('Abgelaufen', 'Expired'), value: expired, color: '#e74c3c', light: '#fad1cc' },
    { label: t('Abgelehnt', 'Rejected'), value: rejected, color: '#6B5242', light: '#d0c4bc' },
    { label: t('Eingeladen', 'Invited'), value: invited, color: '#295A97', light: '#c4d6e8' },
  ]
  return raw.filter((d) => d.value > 0)
  }, [t, pending, active, deactivated, expired, rejected])

  const total = data.reduce((s, d) => s + d.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0].payload
      const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
      return (
        <div className="rounded border bg-white px-3 py-2 text-xs shadow-sm" style={{ borderColor: '#d0d3cc' }}>
          <p className="font-semibold" style={{ color: '#252C27' }}>{d.label}</p>
          <p style={{ color: d.color }}>{d.value} ({pct}%)</p>
        </div>
      )
    }
    return null
  }

  if (data.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
            {t('Verteilung nach Status', 'Distribution by Status')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm" style={{ color: '#5a5a5a' }}>{t('Keine Daten', 'No data')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
          {t('Verteilung nach Status', 'Distribution by Status')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
          <div style={{ height: 160, width: 160 }} className="shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 sm:mt-0 sm:flex-col">
            {data.map((d) => {
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
              return (
                <div key={d.label} className="flex items-center gap-2 text-sm">
                  <div className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span style={{ color: '#5a5a5a' }}>{d.label}</span>
                  <span className="font-semibold" style={{ color: '#1a1a1a' }}>{d.value}</span>
                  <span style={{ color: '#BBB5A9' }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
