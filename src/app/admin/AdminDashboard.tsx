'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language'
import { provisionWlan, provisionLibrary, revokeWlan, revokeLibrary } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wifi, Book, CheckCircle2, XCircle } from 'lucide-react'

interface Application {
  id: string
  guestName: string
  hostName: string
  arrivalDate: string
  departureDate: string
  wlanAccess: boolean
  libraryAccess: boolean
  wlanProvisioned: boolean
  libraryProvisioned: boolean
  guestNumber: string | null
}

export function AdminDashboard({ applications }: { applications: Application[] }) {
  const { t, lang } = useLanguage()
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'
  const [processing, setProcessing] = useState<string | null>(null)

  const sorted = [...applications].sort((a, b) => {
    return new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime()
  })

  async function handleProvision(id: string, type: 'wlan' | 'library') {
    setProcessing(id)
    if (type === 'wlan') await provisionWlan(id)
    else await provisionLibrary(id)
    setProcessing(null)
  }

  async function handleRevoke(id: string, type: 'wlan' | 'library') {
    setProcessing(id)
    if (type === 'wlan') await revokeWlan(id)
    else await revokeLibrary(id)
    setProcessing(null)
  }

  return (
    <div className="space-y-3">
      {sorted.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-10 text-center text-sm" style={{ color: '#5a5a5a' }}>
            {t('Keine genehmigten Gäste.', 'No approved guests.')}
          </CardContent>
        </Card>
      )}

      {sorted.map((app) => {
        const wlanDone = app.wlanProvisioned
        const libDone = app.libraryProvisioned
        const busy = processing === app.id

        return (
          <Card key={app.id} className={`border-0 shadow-sm transition-opacity ${busy ? 'opacity-60' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
                  {app.guestName || t('(Name ausstehend)', '(Name pending)')}
                </CardTitle>
                <p className="text-xs" style={{ color: '#928781' }}>
                  {app.guestNumber ?? '---'} &middot; {t('Betreuer', 'Host')}: {app.hostName}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {/* WLAN row */}
                <div className="flex flex-wrap items-center gap-3 rounded p-3 text-sm" style={{ backgroundColor: app.wlanAccess ? (wlanDone ? '#d4edda' : '#fff3cd') : '#f0f0f0' }}>
                  <Wifi className="h-5 w-5 shrink-0" style={{ color: wlanDone ? '#27ae60' : app.wlanAccess ? '#f5a623' : '#BBB5A9' }} />
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold" style={{ color: '#1a1a1a' }}>
                      {t('WLAN', 'WLAN')}
                    </span>
                    <p className="text-xs" style={{ color: '#5a5a5a' }}>
                      {app.wlanAccess ? t('Vom Gast beantragt', 'Requested by guest') : t('Nicht beantragt', 'Not requested')}
                      {wlanDone ? ` · ${t('Bereitgestellt', 'Provisioned')}` : ` · ${t('Nicht bereitgestellt', 'Not provisioned')}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {app.wlanAccess && !wlanDone && (
                      <button
                        onClick={() => handleProvision(app.id, 'wlan')}
                        disabled={busy}
                        className="rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                        style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
                      >
                        {busy ? '...' : t('Bereitstellen', 'Provision')}
                      </button>
                    )}
                    {wlanDone && (
                      <button
                        onClick={() => handleRevoke(app.id, 'wlan')}
                        disabled={busy}
                        className="rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                        style={{ backgroundColor: '#fdedec', color: '#e74c3c' }}
                      >
                        {busy ? '...' : t('Entziehen', 'Revoke')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Library row */}
                <div className="flex flex-wrap items-center gap-3 rounded p-3 text-sm" style={{ backgroundColor: app.libraryAccess ? (libDone ? '#d4edda' : '#fff3cd') : '#f0f0f0' }}>
                  <Book className="h-5 w-5 shrink-0" style={{ color: libDone ? '#27ae60' : app.libraryAccess ? '#f5a623' : '#BBB5A9' }} />
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold" style={{ color: '#1a1a1a' }}>
                      {t('Bibliothek', 'Library')}
                    </span>
                    <p className="text-xs" style={{ color: '#5a5a5a' }}>
                      {app.libraryAccess ? t('Vom Gast beantragt', 'Requested by guest') : t('Nicht beantragt', 'Not requested')}
                      {libDone ? ` · ${t('Bereitgestellt', 'Provisioned')}` : ` · ${t('Nicht bereitgestellt', 'Not provisioned')}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {app.libraryAccess && !libDone && (
                      <button
                        onClick={() => handleProvision(app.id, 'library')}
                        disabled={busy}
                        className="rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                        style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
                      >
                        {busy ? '...' : t('Bereitstellen', 'Provision')}
                      </button>
                    )}
                    {libDone && (
                      <button
                        onClick={() => handleRevoke(app.id, 'library')}
                        disabled={busy}
                        className="rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                        style={{ backgroundColor: '#fdedec', color: '#e74c3c' }}
                      >
                        {busy ? '...' : t('Entziehen', 'Revoke')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
