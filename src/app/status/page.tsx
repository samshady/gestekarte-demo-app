'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Search } from 'lucide-react'

export default function StatusPage() {
  const { t, lang } = useLanguage()
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'
  const [refNumber, setRefNumber] = useState('')
  const [application, setApplication] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!refNumber.trim()) return

    setLoading(true)
    setError('')
    setApplication(null)

    try {
      const res = await fetch(`/api/applications/search?ref=${encodeURIComponent(refNumber.trim())}`)
      if (!res.ok) {
        setError(t('Kein Antrag mit dieser Referenznummer gefunden.', 'No application found with this reference number.'))
        return
      }
      const data = await res.json()
      setApplication(data)
    } catch {
      setError(t('Fehler bei der Suche.', 'Error during lookup.'))
    } finally {
      setLoading(false)
    }
  }

  const trafficLight: Record<string, { label: string; bg: string; text: string }> = {
    PENDING_HOST: { label: t('Ausstehend', 'Pending'), bg: '#f5a623', text: '#1a1a1a' },
    APPROVED: { label: t('Genehmigt', 'Approved'), bg: '#27ae60', text: '#ffffff' },
    EXPIRED: { label: t('Abgelaufen', 'Expired'), bg: '#e74c3c', text: '#ffffff' },
    DEACTIVATED: { label: t('Deaktiviert', 'Deactivated'), bg: '#928781', text: '#ffffff' },
    REJECTED: { label: t('Abgelehnt', 'Rejected'), bg: '#6B5242', text: '#ffffff' },
    INVITED: { label: t('Eingeladen', 'Invited'), bg: '#295A97', text: '#ffffff' },
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold" style={{ color: '#1a1a1a' }}>
        {t('Antragsstatus', 'Application Status')}
      </h1>
      <p className="mb-6 text-sm" style={{ color: '#5a5a5a' }}>
        {t(
          'Geben Sie Ihre Antragsnummer (z.B. A-0001) oder Gastenummer (z.B. G-0001) ein, um den aktuellen Status Ihres Antrags und Ihrer Dienste einzusehen.',
          'Enter your application number (e.g. A-0001) or guest number (e.g. G-0001) to view the current status of your application and services.'
        )}
      </p>

      <form onSubmit={handleSearch} className="flex items-end gap-3 mb-8">
        <div className="flex-1 space-y-1">
          <Label htmlFor="status-ref" style={{ color: '#1a1a1a' }}>
            {t('Antrags- oder Gastenummer', 'Application or Guest Number')}
          </Label>
          <Input
            id="status-ref"
            value={refNumber}
            onChange={(e) => setRefNumber(e.target.value)}
            placeholder="A-0001 oder G-0001"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !refNumber.trim()}
          style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
        >
          {loading ? (
            t('Suche...', 'Searching...')
          ) : (
            <><Search className="h-4 w-4 mr-1" />{t('Suchen', 'Search')}</>
          )}
        </Button>
      </form>

      {error && (
        <div
          className="mb-6 rounded border p-3 text-sm"
          style={{ backgroundColor: '#fff5f5', borderColor: '#e74c3c', color: '#c0392b' }}
        >
          {error}
        </div>
      )}

      {application && (
        <div className="space-y-6">
          <Card style={{ borderColor: '#d0d3cc' }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base" style={{ color: '#252C27' }}>
                {t('Antragsdetails', 'Application Details')}
              </CardTitle>
              <Badge
                className="px-3 py-1 text-xs font-semibold rounded-full border-0"
                style={{
                  backgroundColor: (trafficLight[application.status] ?? trafficLight['EXPIRED']).bg,
                  color: (trafficLight[application.status] ?? trafficLight['EXPIRED']).text,
                }}
              >
                {(trafficLight[application.status] ?? trafficLight['EXPIRED']).label}
              </Badge>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <dt style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>
                    {application.guestNumber ? t('Gastenummer', 'Guest Number') : t('Antragsnummer', 'Application Number')}
                  </dt>
                  <dd style={{ color: '#295A97', fontWeight: 600, fontFamily: 'monospace' }}>
                    {application.guestNumber ?? application.applicationNumber}
                  </dd>
                </div>
                <div>
                  <dt style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>{t('Name', 'Name')}</dt>
                  <dd style={{ color: '#1a1a1a', fontWeight: 500 }}>{application.guestName}</dd>
                </div>
                <div>
                  <dt style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>E-Mail</dt>
                  <dd style={{ color: '#1a1a1a', fontWeight: 500 }}>{application.guestEmail}</dd>
                </div>
                <div>
                  <dt style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>{t('Betreuer', 'Host')}</dt>
                  <dd style={{ color: '#1a1a1a', fontWeight: 500 }}>{application.hostName}</dd>
                </div>
                <div>
                  <dt style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>{t('Anreise', 'Arrival')}</dt>
                  <dd style={{ color: '#1a1a1a', fontWeight: 500 }}>{new Date(application.arrivalDate).toLocaleDateString(locale)}</dd>
                </div>
                <div>
                  <dt style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>{t('Abreise', 'Departure')}</dt>
                  <dd style={{ color: '#1a1a1a', fontWeight: 500 }}>{new Date(application.departureDate).toLocaleDateString(locale)}</dd>
                </div>
                <div>
                  <dt style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>{t('Gastgeberadresse', 'Host Address')}</dt>
                  <dd style={{ color: '#1a1a1a', fontWeight: 500 }}>{application.halleAddress}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {application.status !== 'PENDING_HOST' && (
            <Card style={{ borderColor: '#d0d3cc' }}>
              <CardHeader>
                <CardTitle className="text-base" style={{ color: '#252C27' }}>
                  {t('Dienstleistungen / Services', 'Services')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: t('WLAN-Zugang (eduroam)', 'WLAN Access (eduroam)'), active: application.wlanAccess },
                  { label: t('Bibliothekszugang', 'Library Access'), active: application.libraryAccess },
                  { label: t('Mensa-Zahlungen (NFC)', 'Mensa Payments (NFC)'), active: application.mensaPayments },
                  { label: t('Datenbank- und Forschungszugang', 'Database & Research Access'), active: application.databaseAccess },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-3 rounded p-3 text-sm"
                    style={{ backgroundColor: s.active ? '#e8f5e9' : '#fff5f5' }}
                  >
                    {s.active
                      ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: '#27ae60' }} />
                      : <XCircle className="h-5 w-5 shrink-0" style={{ color: '#e74c3c' }} />
                    }
                    <span className="font-semibold" style={{ color: '#1a1a1a' }}>{s.label}</span>
                    <span className="ml-auto text-xs font-medium" style={{ color: s.active ? '#27ae60' : '#5a5a5a' }}>
                      {s.active ? t('Aktiv', 'Active') : t('Inaktiv', 'Inactive')}
                    </span>
                  </div>
                ))}
                <div
                  className="flex items-center gap-3 rounded p-3 text-sm"
                  style={{ backgroundColor: '#fff5f5' }}
                >
                  <XCircle className="h-5 w-5 shrink-0" style={{ color: '#e74c3c' }} />
                  <span className="font-semibold" style={{ color: '#1a1a1a' }}>
                    {t('Externer VPN-Zugang', 'External VPN Access')}
                  </span>
                  <span className="ml-auto text-xs font-medium" style={{ color: '#5a5a5a' }}>
                    {t('Nicht verfugbar', 'Not available')}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
