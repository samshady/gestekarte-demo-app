'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLanguage } from '@/lib/language'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'

const colorPalette = ['#9FBF47', '#295A97', '#f5a623', '#928781', '#e74c3c', '#6B5242']

export function MonthlyChart({
  applications,
}: {
  applications: { createdAt: Date }[]
}) {
  const { t, lang } = useLanguage()

  const data = useMemo(() => {
    const now = new Date()
    const map = new Map<string, number>()

    for (const app of applications) {
      const d = new Date(app.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      map.set(key, (map.get(key) ?? 0) + 1)
    }

    const result: { month: string; label: string; count: number }[] = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      result.push({
        month: key,
        label: d.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { month: 'short', year: '2-digit' }),
        count: map.get(key) ?? 0,
      })
    }
    return result
  }, [applications, lang])

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0].payload
      return (
        <div className="rounded border bg-white px-3 py-2 text-xs shadow-sm" style={{ borderColor: '#d0d3cc' }}>
          <p className="font-semibold" style={{ color: '#252C27' }}>{d.label}</p>
          <p style={{ color: '#295A97' }}>{d.count} {t('Antrage', 'applications')}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
          {t('Antrage pro Monat', 'Applications per Month')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EAE5" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#928781' }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={40}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#928781' }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#E8EAE5' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {data.map((entry, i) => (
                  <Cell
                    key={entry.month}
                    fill={entry.count > 0 ? colorPalette[i % colorPalette.length] : '#E8EAE5'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-xs" style={{ color: '#BBB5A9' }}>
          {t('Letzte 12 Monate', 'Last 12 months')}
        </p>
      </CardContent>
    </Card>
  )
}
