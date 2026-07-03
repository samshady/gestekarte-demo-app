'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { lookupApplication, extendApplication } from './extendActions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/lib/language'

function SubmitButton() {
  const { pending } = useFormStatus()
  const { t } = useLanguage()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full font-semibold"
      style={{ backgroundColor: '#9FBF47', color: '#252C27' }}
    >
      {pending
        ? t('Wird gesendet...', 'Sending...')
        : t('Verlängern', 'Extend')}
    </Button>
  )
}

export function ExtendForm() {
  const { t, lang } = useLanguage()
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'
  const [refNumber, setRefNumber] = useState('')
  const [application, setApplication] = useState<{
    id: string
    guestName: string
    guestEmail: string
    hostName: string
    arrivalDate: Date
    departureDate: Date
    status: string
  } | null>(null)
  const [error, setError] = useState('')
  const [newDepartureDate, setNewDepartureDate] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!refNumber.trim()) return

    setLoading(true)
    setError('')
    setApplication(null)

    try {
      const app = await lookupApplication(refNumber.trim())
      if (!app) {
        setError(
          t(
            'Kein Antrag mit dieser Referenznummer gefunden.',
            'No application found with this reference number.'
          )
        )
      } else {
        setApplication(app)
      }
    } catch {
      setError(
        t('Fehler bei der Suche.', 'Error during lookup.')
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleExtend(formData: FormData) {
    if (!application) return
    formData.set('id', application.id)
    await extendApplication(formData)
  }

  const labelStyle = { color: '#1a1a1a' }

  return (
    <div className="space-y-6">
      {/* Lookup form */}
      <form onSubmit={handleLookup} className="flex items-end gap-3">
        <div className="flex-1 space-y-1">
          <Label htmlFor="refNumber" style={labelStyle}>
            {t('Referenznummer', 'Reference Number')}
          </Label>
          <Input
            id="refNumber"
            value={refNumber}
            onChange={(e) => setRefNumber(e.target.value)}
            placeholder="G-2026-XXXX"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !refNumber.trim()}
          style={{ backgroundColor: '#295A97', color: '#ffffff' }}
        >
          {loading
            ? t('Suche...', 'Searching...')
            : t('Suchen', 'Search')}
        </Button>
      </form>

      {error && (
        <div
          className="rounded border p-3 text-sm"
          style={{ backgroundColor: '#fff5f5', borderColor: '#e74c3c', color: '#c0392b' }}
        >
          {error}
        </div>
      )}

      {/* Auto-filled details */}
      {application && (
        <form action={handleExtend} className="space-y-4 rounded border p-4" style={{ borderColor: '#d0d3cc' }}>
          <h3 className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
            {t('Antragsdetails', 'Application Details')}
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <span style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>
                {t('Name', 'Name')}
              </span>
              <p style={{ color: '#1a1a1a', fontWeight: 500 }}>{application.guestName}</p>
            </div>
            <div>
              <span style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>
                E-Mail
              </span>
              <p style={{ color: '#1a1a1a', fontWeight: 500 }}>{application.guestEmail}</p>
            </div>
            <div>
              <span style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>
                {t('Betreuer', 'Host')}
              </span>
              <p style={{ color: '#1a1a1a', fontWeight: 500 }}>{application.hostName}</p>
            </div>
            <div>
              <span style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>
                {t('Status', 'Status')}
              </span>
              <p style={{ color: '#1a1a1a', fontWeight: 500 }}>
                {application.status === 'PENDING_HOST' ? t('Ausstehend', 'Pending') : application.status === 'APPROVED' ? t('Genehmigt', 'Approved') : application.status === 'DEACTIVATED' ? t('Deaktiviert', 'Deactivated') : application.status === 'REJECTED' ? t('Abgelehnt', 'Rejected') : application.status === 'INVITED' ? t('Eingeladen', 'Invited') : t('Abgelaufen', 'Expired')}
              </p>
            </div>
            <div>
              <span style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>
                {t('Anreise', 'Arrival')}
              </span>
              <p style={{ color: '#1a1a1a', fontWeight: 500 }}>
                {application.arrivalDate.toLocaleDateString(locale)}
              </p>
            </div>
            <div>
              <span style={{ color: '#5a5a5a', fontSize: '0.82em', textTransform: 'uppercase' }}>
                {t('Aktuelles Abreisedatum', 'Current Departure')}
              </span>
              <p style={{ color: '#1a1a1a', fontWeight: 500 }}>
                {application.departureDate.toLocaleDateString(locale)}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="newDepartureDate" style={labelStyle}>
              {t('Neues Abreisedatum', 'New Departure Date')}
            </Label>
            <Input
              id="newDepartureDate"
              name="departureDate"
              type="date"
              value={newDepartureDate}
              onChange={(e) => setNewDepartureDate(e.target.value)}
              required
            />
          </div>

          <SubmitButton />
        </form>
      )}
    </div>
  )
}
