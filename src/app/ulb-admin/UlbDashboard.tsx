'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language'
import { ulbProvisionLibrary, ulbRevokeLibrary } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, Book } from 'lucide-react'

interface Application {
  id: string
  guestName: string
  hostName: string
  libraryAccess: boolean
  libraryProvisioned: boolean
  guestNumber: string | null
}

export function UlbDashboard({ applications }: { applications: Application[] }) {
  const { t } = useLanguage()
  const [processing, setProcessing] = useState<string | null>(null)

  const sorted = [...applications].filter((a) => a.libraryAccess).sort((a, b) => {
    return (a.guestName || '').localeCompare(b.guestName || '')
  })

  async function handleProvision(id: string) {
    setProcessing(id)
    await ulbProvisionLibrary(id)
    setProcessing(null)
  }

  async function handleRevoke(id: string) {
    setProcessing(id)
    await ulbRevokeLibrary(id)
    setProcessing(null)
  }

  return (
    <div className="space-y-3">
      {sorted.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-10 text-center text-sm" style={{ color: '#5a5a5a' }}>
            {t('Keine Gäste mit Bibliothekszugang.', 'No guests with library access.')}
          </CardContent>
        </Card>
      )}

      {sorted.map((app) => {
        const libDone = app.libraryProvisioned
        const busy = processing === app.id

        return (
          <Card key={app.id} className={`border-0 shadow-sm ${busy ? 'opacity-60 transition-opacity' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
                  {app.guestName || t('(Name ausstehend)', '(Name pending)')}
                </CardTitle>
                <p className="text-xs" style={{ color: '#928781' }}>
                  {app.guestNumber ?? '---'} &middot; {t('Betreuer', 'Host')}: {app.hostName}
                </p>
              </div>
              {libDone
                ? <CheckCircle2 className="h-5 w-5" style={{ color: '#27ae60' }} />
                : <XCircle className="h-5 w-5" style={{ color: '#e74c3c' }} />
              }
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded p-3 text-sm" style={{ backgroundColor: libDone ? '#e8f5e9' : '#fff5f5' }}>
                <Book className="h-5 w-5 shrink-0" style={{ color: libDone ? '#27ae60' : '#e74c3c' }} />
                <div className="flex-1">
                  <span className="font-semibold" style={{ color: '#1a1a1a' }}>
                    {t('Bibliothekszugang', 'Library Access')}
                  </span>
                  <p className="text-xs" style={{ color: '#5a5a5a' }}>
                    {libDone ? t('Bereitgestellt', 'Provisioned') : t('Nicht bereitgestellt', 'Not provisioned')}
                  </p>
                </div>
                {!libDone && (
                  <button
                    onClick={() => handleProvision(app.id)}
                    disabled={busy}
                    className="rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
                  >
                    {busy ? '...' : t('Bereitstellen', 'Provision')}
                  </button>
                )}
                {libDone && (
                  <button
                    onClick={() => handleRevoke(app.id)}
                    disabled={busy}
                    className="rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ backgroundColor: '#fdedec', color: '#e74c3c' }}
                  >
                    {busy ? '...' : t('Entziehen', 'Revoke')}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
