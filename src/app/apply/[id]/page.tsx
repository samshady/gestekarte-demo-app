'use client'

import { use, useState } from 'react'
import { useLanguage } from '@/lib/language'
import { completeApplication } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormStatus } from 'react-dom'

const WLAN_TERMS_URL = 'https://wcms.itz.uni-halle.de/download.php?down=43205&elem=2991452'
const ULB_TERMS_URL = 'https://wcms.itz.uni-halle.de/download.php?down=43208&elem=2991460'

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
      {pending ? t('Wird gesendet...', 'Sending...') : t('Absenden & Bestätigen', 'Submit & Confirm')}
    </Button>
  )
}

export default function GuestCompletePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { t } = useLanguage()
  const [arrivalDate, setArrivalDate] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [error, setError] = useState('')
  const [wlanChecked, setWlanChecked] = useState(false)
  const [wlanTerms, setWlanTerms] = useState(false)
  const [libraryChecked, setLibraryChecked] = useState(false)
  const [libraryTerms, setLibraryTerms] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError('')
    formData.set('id', id)
    formData.set('wlanAccess', wlanChecked ? 'on' : 'off')
    formData.set('libraryAccess', libraryChecked ? 'on' : 'off')
    if (wlanChecked && !wlanTerms) { setError(t('Bitte akzeptieren Sie die WLAN-Nutzungsbedingungen.', 'Please accept the WLAN terms.')); return }
    if (libraryChecked && !libraryTerms) { setError(t('Bitte akzeptieren Sie die Bibliotheksnutzungsbedingungen.', 'Please accept the library terms.')); return }
    try {
      await completeApplication(formData)
    } catch {
      setError(t('Bitte bestätigen Sie Ihre Angaben.', 'Please confirm your information.'))
    }
  }

  const labelStyle = { color: '#1a1a1a' }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold" style={{ color: '#1a1a1a' }}>
        {t('Angaben vervollständigen', 'Complete Your Details')}
      </h1>
      <p className="mb-6 text-sm" style={{ color: '#5a5a5a' }}>
        {t(
          'Sie wurden von Ihrem Betreuer eingeladen. Bitte füllen Sie Ihre Daten aus und bestätigen Sie diese.',
          'You have been invited by your host. Please fill in your details and confirm them.'
        )}
      </p>

      {error && (
        <div className="mb-4 rounded border p-3 text-sm" style={{ backgroundColor: '#fff5f5', borderColor: '#e74c3c', color: '#c0392b' }}>
          {error}
        </div>
      )}

      <div
        className="mb-6 rounded border p-3 text-xs leading-relaxed"
        style={{ backgroundColor: '#eef3fa', borderColor: '#295A97', color: '#1a1a1a' }}
      >
        <strong>{t('Hinweis:', 'Notice:')}</strong>{' '}
        {t(
          'Bitte reichen Sie den Antrag mindestens 14 Tage vor Anreise des Gasts ein. Die maximale Aufenthaltsdauer beträgt ein Semester (ca. 6 Monate).',
          'Please submit the application at least 14 days before the guest\'s arrival. The maximum stay duration is one semester (approx. 6 months).'
        )}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
            {t('Persönliche Daten', 'Personal Information')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="id" value={id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="guestSalutation" style={labelStyle}>{t('Anrede', 'Salutation')}</Label>
                <select id="guestSalutation" name="guestSalutation" className="w-full rounded border px-3 py-2 text-sm" style={{ borderColor: '#d0d3cc', color: '#1a1a1a', backgroundColor: '#FFFFFF' }}>
                  <option value="">-</option>
                  <option value="Herr">{t('Herr', 'Mr.')}</option>
                  <option value="Frau">{t('Frau', 'Ms.')}</option>
                  <option value="Dr.">Dr.</option>
                  <option value="Prof. Dr.">Prof. Dr.</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="nationality" style={labelStyle}>{t('Staatsangehörigkeit', 'Nationality')}</Label>
                <Input id="nationality" name="nationality" placeholder={t('z.B. Deutsch', 'e.g. German')} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="guestName" style={labelStyle}>{t('Vollständiger Name', 'Full Name')}</Label>
                <Input id="guestName" name="guestName" required placeholder="Dr. ..." />
              </div>
              <div className="space-y-1">
                <Label htmlFor="guestEmail" style={labelStyle}>E-Mail</Label>
                <Input id="guestEmail" name="guestEmail" type="email" required placeholder="gast@example.com" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="dateOfBirth" style={labelStyle}>{t('Geburtsdatum', 'Date of Birth')}</Label>
              <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="homeAddress" style={labelStyle}>{t('Heimatadresse', 'Home Address')}</Label>
              <Input id="homeAddress" name="homeAddress" required placeholder={t('Straße, Stadt, Land', 'Street, City, Country')} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="halleAddress" style={labelStyle}>{t('Adresse in Halle', 'Address in Halle')}</Label>
              <Input id="halleAddress" name="halleAddress" required placeholder="z.B. Georg-Forster-Strasse 2" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="arrivalDate" style={labelStyle}>{t('Anreisedatum', 'Arrival Date')}</Label>
                <Input id="arrivalDate" name="arrivalDate" type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="departureDate" style={labelStyle}>{t('Abreisedatum', 'Departure Date')}</Label>
                <Input id="departureDate" name="departureDate" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
              </div>
            </div>

            {/* Services */}
            <div className="rounded border p-4 space-y-3" style={{ borderColor: '#d0d3cc' }}>
              <p className="text-sm font-semibold" style={{ color: '#252C27' }}>
                {t('Dienstleistungen', 'Services')}
              </p>

              {/* WLAN */}
              <div className="flex items-start gap-3 rounded p-3" style={{ backgroundColor: wlanChecked ? '#fffde7' : '#f5f5f5' }}>
                <input id="wlanAccess" name="wlanAccess" type="checkbox" checked={wlanChecked} onChange={(e) => { setWlanChecked(e.target.checked); if (!e.target.checked) setWlanTerms(false) }} className="mt-1 h-4 w-4 shrink-0 rounded" style={{ accentColor: '#9FBF47' }} />
                <div>
                  <label htmlFor="wlanAccess" className="text-sm font-semibold cursor-pointer" style={{ color: '#1a1a1a' }}>{t('WLAN-Zugang (eduroam)', 'WLAN Access (eduroam)')}</label>
                  <p className="text-xs" style={{ color: '#5a5a5a' }}>{t('Eduroam-WLAN auf dem gesamten Campus', 'Eduroam WLAN across the campus')}</p>
                  {wlanChecked && (
                    <div className="mt-2 flex items-start gap-2">
                      <input id="wlanTerms" type="checkbox" checked={wlanTerms} onChange={(e) => setWlanTerms(e.target.checked)} required className="mt-0.5 h-4 w-4 shrink-0 rounded" style={{ accentColor: '#9FBF47' }} />
                      <label htmlFor="wlanTerms" className="text-xs cursor-pointer" style={{ color: '#1a1a1a' }}>
                        {t('Ich akzeptiere die WLAN-Nutzungsbedingungen.', 'I accept the WLAN terms.')}{' '}
                        <a href={WLAN_TERMS_URL} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#295A97' }}>{t('Ansehen', 'View')}</a>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Library */}
              <div className="flex items-start gap-3 rounded p-3" style={{ backgroundColor: libraryChecked ? '#fffde7' : '#f5f5f5' }}>
                <input id="libraryAccess" name="libraryAccess" type="checkbox" checked={libraryChecked} onChange={(e) => { setLibraryChecked(e.target.checked); if (!e.target.checked) setLibraryTerms(false) }} className="mt-1 h-4 w-4 shrink-0 rounded" style={{ accentColor: '#9FBF47' }} />
                <div>
                  <label htmlFor="libraryAccess" className="text-sm font-semibold cursor-pointer" style={{ color: '#1a1a1a' }}>{t('Bibliothekszugang (ULB)', 'Library Access (ULB)')}</label>
                  <p className="text-xs" style={{ color: '#5a5a5a' }}>{t('Zugang zur ULB und Campusbibliotheken.', 'Access to ULB and campus libraries.')}</p>
                  {libraryChecked && (
                    <div className="mt-2 flex items-start gap-2">
                      <input id="libraryTerms" type="checkbox" checked={libraryTerms} onChange={(e) => setLibraryTerms(e.target.checked)} required className="mt-0.5 h-4 w-4 shrink-0 rounded" style={{ accentColor: '#9FBF47' }} />
                      <label htmlFor="libraryTerms" className="text-xs cursor-pointer" style={{ color: '#1a1a1a' }}>
                        {t('Ich akzeptiere die Bibliotheksnutzungsbedingungen.', 'I accept the library terms.')}{' '}
                        <a href={ULB_TERMS_URL} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#295A97' }}>{t('Ansehen', 'View')}</a>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Signature / confirmation */}
            <div className="rounded border p-4" style={{ borderColor: '#d0d3cc', backgroundColor: '#f4f8ed' }}>
              <div className="flex items-start gap-3">
                <input id="guestSigned" name="guestSigned" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 rounded" style={{ accentColor: '#9FBF47' }} />
                <div>
                  <label htmlFor="guestSigned" className="text-sm font-semibold cursor-pointer" style={{ color: '#1a1a1a' }}>
                    {t('Ich bestätige, dass alle Angaben korrekt und vollständig sind.', 'I confirm that all information is correct and complete.')}
                  </label>
                  <p className="text-xs mt-1" style={{ color: '#5a5a5a' }}>
                    {t('Diese Bestätigung gilt als digitale Unterschrift.', 'This confirmation counts as a digital signature.')}
                  </p>
                </div>
              </div>
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
