'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useLanguage } from '@/lib/language'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'

export function ApplicationTimeline({
  applications,
}: {
  applications: { id: string; guestName: string; status: string; createdAt: Date; guestNumber: string | null; applicationNumber: string | null }[]
}) {
  const { t, lang } = useLanguage()
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'

  const sorted = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 15),
    [applications]
  )

  const statusConfig: Record<string, { color: string; icon: typeof Clock; bg: string }> = {
    PENDING_HOST: { color: '#f5a623', icon: Clock, bg: '#fef7ed' },
    APPROVED: { color: '#9FBF47', icon: CheckCircle2, bg: '#f4f8ed' },
    DEACTIVATED: { color: '#928781', icon: XCircle, bg: '#f3f2f0' },
    EXPIRED: { color: '#e74c3c', icon: XCircle, bg: '#fdedec' },
    REJECTED: { color: '#6B5242', icon: XCircle, bg: '#f0ebe7' },
    INVITED: { color: '#295A97', icon: Clock, bg: '#eef3fa' },
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
          {t('Letzte Antrage', 'Recent Applications')}
        </CardTitle>
        <CardDescription className="text-xs" style={{ color: '#928781' }}>
          {t('Die 15 neuesten Antrage', 'The 15 most recent applications')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {sorted.length === 0 ? (
          <p className="px-6 pb-6 text-center text-sm" style={{ color: '#5a5a5a' }}>
            {t('Keine Antrage vorhanden', 'No applications yet')}
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: '#E8EAE5' }}>
            {sorted.map((app) => {
              const cfg = statusConfig[app.status] ?? statusConfig['EXPIRED']
              const Icon = cfg.icon
              return (
                <div
                  key={app.id}
                  className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: cfg.bg }}
                  >
                    <Icon className="h-4 w-4" style={{ color: cfg.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium" style={{ color: '#1a1a1a' }}>
                      {app.guestName}
                    </p>
                    <p className="text-xs" style={{ color: '#928781' }}>
                      {new Date(app.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {app.status === 'PENDING_HOST'
                      ? t('Ausstehend', 'Pending')
                      : app.status === 'APPROVED'
                      ? t('Genehmigt', 'Approved')
                      : app.status === 'DEACTIVATED'
                      ? t('Deaktiviert', 'Deactivated')
                      : app.status === 'REJECTED'
                      ? t('Abgelehnt', 'Rejected')
                      : app.status === 'INVITED'
                      ? t('Eingeladen', 'Invited')
                      : t('Abgelaufen', 'Expired')}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
