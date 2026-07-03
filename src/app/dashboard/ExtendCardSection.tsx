'use client'

import { useState } from 'react'
import { extendApplicationExpiry } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/lib/language'

export function ExtendCardSection() {
  const { t } = useLanguage()
  const [referenceNumber, setReferenceNumber] = useState('')
  const [newDepartureDate, setNewDepartureDate] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!referenceNumber.trim() || !newDepartureDate) return

    setPending(true)
    setMessage(null)
    try {
      await extendApplicationExpiry(referenceNumber.trim(), newDepartureDate)
      setMessage({
        type: 'success',
        text: t(
          'Ablaufdatum erfolgreich verlangert.',
          'Expiry date successfully extended.'
        ),
      })
      setReferenceNumber('')
      setNewDepartureDate('')
    } catch {
      setMessage({
        type: 'error',
        text: t(
          'Fehler beim Verlängern. Uberprufen Sie die Referenznummer.',
          'Error extending. Check the reference number.'
        ),
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
          {t('Karte verlängern', 'Extend Card')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="extend-ref" style={{ color: '#1a1a1a' }}>
              {t('Referenznummer', 'Reference Number')}
            </Label>
            <Input
              id="extend-ref"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="G-2026-XXXX"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="extend-date" style={{ color: '#1a1a1a' }}>
              {t('Neues Abreisedatum', 'New Departure Date')}
            </Label>
            <Input
              id="extend-date"
              type="date"
              value={newDepartureDate}
              onChange={(e) => setNewDepartureDate(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={pending || !referenceNumber.trim() || !newDepartureDate}
            style={{
              backgroundColor: '#9FBF47',
              color: '#252C27',
            }}
          >
            {pending
              ? t('Wird verarbeitet...', 'Processing...')
              : t('Verlängern', 'Extend')}
          </Button>
          {message && (
            <div
              className="flex items-start gap-2 rounded p-3 text-sm"
              style={{
                backgroundColor: message.type === 'success' ? '#e8f5e9' : '#fff5f5',
                color: message.type === 'success' ? '#1a1a1a' : '#c0392b',
              }}
            >
              {message.type === 'success' && (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: '#27ae60' }} />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
