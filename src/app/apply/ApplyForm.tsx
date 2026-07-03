'use client'

import { useFormStatus } from 'react-dom'
import { useRef, useState } from 'react'
import { submitApplication } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { XCircle, BookOpen } from 'lucide-react'
import { useLanguage } from '@/lib/language'

const WLAN_TERMS_URL = 'https://wcms.itz.uni-halle.de/download.php?down=43205&elem=2991452'
const ULB_TERMS_URL = 'https://wcms.itz.uni-halle.de/download.php?down=43208&elem=2991460'

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  const { t } = useLanguage()
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="w-full font-semibold"
      style={{ backgroundColor: '#9FBF47', color: '#252C27' }}
    >
      {pending
        ? t('Wird gesendet...', 'Sending...')
        : t('Antrag einreichen', 'Submit Application')}
    </Button>
  )
}

export function ApplyForm() {
  const { t } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [wlanChecked, setWlanChecked] = useState(false)
  const [wlanTerms, setWlanTerms] = useState(false)
  const [libraryChecked, setLibraryChecked] = useState(false)
  const [libraryTerms, setLibraryTerms] = useState(false)

  const requiredFields: Array<{ name: string; label: () => string }> = [
    { name: 'guestName', label: () => t('Vollstandiger Name', 'Full Name') },
    { name: 'guestEmail', label: () => t('E-Mail', 'Email') },
    { name: 'dateOfBirth', label: () => t('Geburtsdatum', 'Date of Birth') },
    { name: 'homeAddress', label: () => t('Heimatadresse', 'Home Address') },
    { name: 'halleAddress', label: () => t('Adresse in Halle', 'Address in Halle') },
    { name: 'arrivalDate', label: () => t('Anreisedatum', 'Arrival Date') },
    { name: 'departureDate', label: () => t('Abreisedatum', 'Departure Date') },
    { name: 'hostName', label: () => t('Gastgebender Betreuer', 'Host Name') },
  ]

  function validate(data: FormData): string[] {
    const missing: string[] = []
    for (const field of requiredFields) {
      const val = data.get(field.name)
      if (!val || String(val).trim() === '') {
        missing.push(field.label())
      }
    }
    if (wlanChecked && !wlanTerms) {
      missing.push(t('Zustimmung zu den WLAN-Nutzungsbedingungen', 'WLAN terms acceptance'))
    }
    if (libraryChecked && !libraryTerms) {
      missing.push(t('Zustimmung zu den Bibliotheksnutzungsbedingungen', 'Library terms acceptance'))
    }
    return missing
  }

  async function handleSubmit(formData: FormData) {
    const missing = validate(formData)
    if (missing.length > 0) {
      setErrors(missing)
      return
    }
    setErrors([])
    formData.set('wlanAccess', wlanChecked ? 'on' : 'off')
    formData.set('libraryAccess', libraryChecked ? 'on' : 'off')
    await submitApplication(formData)
  }

  const labelStyle = { color: '#1a1a1a' }
  const hintStyle = { color: '#5a5a5a', fontSize: '0.8em' }
  const requiredMark = <span style={{ color: '#9FBF47' }}>*</span>

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      {/* Business constraint notice */}
      <div
        className="rounded border p-3 text-xs leading-relaxed"
        style={{ backgroundColor: '#eef3fa', borderColor: '#295A97', color: '#1a1a1a' }}
      >
        <strong>{t('Hinweis:', 'Notice:')}</strong>{' '}
        {t(
          'Bitte reichen Sie den Antrag mindestens 14 Tage vor Anreise des Gasts ein. Die maximale Aufenthaltsdauer beträgt ein Semester (ca. 6 Monate).',
          'Please submit the application at least 14 days before the guest\'s arrival. The maximum stay duration is one semester (approx. 6 months).'
        )}
      </div>

      {/* Validation error summary */}
      {errors.length > 0 && (
        <div
          className="rounded border p-4 text-sm"
          style={{ backgroundColor: '#fff5f5', borderColor: '#c0392b', color: '#1a1a1a' }}
          role="alert"
        >
          <p className="font-semibold mb-2">
            {t(
              'Bitte fullen Sie alle Pflichtfelder aus:',
              'Please complete all required fields:'
            )}
          </p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Personal details */}
      <fieldset className="space-y-4 rounded border p-4" style={{ borderColor: '#d0d3cc' }}>
        <legend className="text-sm font-semibold px-1" style={{ color: '#1a1a1a' }}>
          {t('Personliche Angaben', 'Personal Details')}
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="guestSalutation" style={labelStyle}>
              {t('Anrede', 'Salutation')}
            </Label>
            <select
              id="guestSalutation"
              name="guestSalutation"
              className="w-full rounded border px-3 py-2 text-sm"
              style={{ borderColor: '#d0d3cc', color: '#1a1a1a', backgroundColor: '#FFFFFF' }}
            >
              <option value="">-</option>
              <option value="Herr">{t('Herr', 'Mr.')}</option>
              <option value="Frau">{t('Frau', 'Ms.')}</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof. Dr.">Prof. Dr.</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="nationality" style={labelStyle}>
              {t('Staatsangehörigkeit', 'Nationality')}
            </Label>
            <Input id="nationality" name="nationality" placeholder={t('z.B. Deutsch', 'e.g. German')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="guestName" style={labelStyle}>
              {t('Vollstandiger Name', 'Full Name')} {requiredMark}
            </Label>
            <Input id="guestName" name="guestName" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="guestEmail" style={labelStyle}>
              E-Mail {requiredMark}
            </Label>
            <Input id="guestEmail" name="guestEmail" type="email" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dateOfBirth" style={labelStyle}>
              {t('Geburtsdatum', 'Date of Birth')} {requiredMark}
            </Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="photo" style={labelStyle}>
              {t('Passfoto', 'Passport Photo')}
            </Label>
            <Input id="photo" name="photo" type="file" accept="image/*" />
            <p className="text-xs" style={hintStyle}>
              {t('Format: 35x45 mm (Passfoto)', 'Format: 35x45 mm (Passport photo)')}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="homeAddress" style={labelStyle}>
            {t('Heimatadresse', 'Home Address')} {requiredMark}
          </Label>
          <Textarea id="homeAddress" name="homeAddress" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="halleAddress" style={labelStyle}>
            {t('Adresse in Halle', 'Address in Halle')} {requiredMark}
          </Label>
          <Textarea id="halleAddress" name="halleAddress" required />
        </div>
      </fieldset>

      {/* Stay details */}
      <fieldset className="space-y-4 rounded border p-4" style={{ borderColor: '#d0d3cc' }}>
        <legend className="text-sm font-semibold px-1" style={{ color: '#1a1a1a' }}>
          {t('Aufenthaltsdetails', 'Stay Details')}
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="arrivalDate" style={labelStyle}>
              {t('Anreisedatum', 'Arrival Date')} {requiredMark}
            </Label>
            <Input id="arrivalDate" name="arrivalDate" type="date" required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="departureDate" style={labelStyle}>
              {t('Abreisedatum', 'Departure Date')} {requiredMark}
            </Label>
            <Input id="departureDate" name="departureDate" type="date" required />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="hostName" style={labelStyle}>
            {t('Gastgebender Betreuer', 'Host Name')} {requiredMark}
          </Label>
          <Input id="hostName" name="hostName" required />
        </div>
      </fieldset>

      {/* Services section */}
      <fieldset className="space-y-4 rounded border p-4" style={{ borderColor: '#d0d3cc' }}>
        <legend className="text-sm font-semibold px-1" style={{ color: '#1a1a1a' }}>
          {t('Dienstleistungen / Services', 'Services')}
        </legend>

        <div className="space-y-4">
          {/* WLAN - opt-in with terms */}
          <div className="flex items-start gap-3 rounded p-3" style={{ backgroundColor: wlanChecked ? '#fffde7' : '#f5f5f5' }}>
            <input
              id="wlanAccess"
              name="wlanAccess"
              type="checkbox"
              checked={wlanChecked}
              onChange={(e) => { setWlanChecked(e.target.checked); if (!e.target.checked) setWlanTerms(false) }}
              className="mt-1 h-4 w-4 shrink-0 rounded"
              style={{ accentColor: '#9FBF47' }}
            />
            <div>
              <label htmlFor="wlanAccess" className="text-sm font-semibold cursor-pointer" style={{ color: '#1a1a1a' }}>
                {t('WLAN-Zugang (eduroam)', 'WLAN Access (eduroam)')}
              </label>
              <p className="text-xs mt-1" style={{ color: '#5a5a5a' }}>
                {t(
                  'Eduroam-WLAN-Zugang fur den gesamten Campus.',
                  'Eduroam WLAN access for the entire campus.'
                )}
              </p>
              {wlanChecked && (
                <div className="mt-2 flex items-start gap-2">
                  <input
                    id="wlanTerms"
                    type="checkbox"
                    checked={wlanTerms}
                    onChange={(e) => setWlanTerms(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 rounded"
                    style={{ accentColor: '#9FBF47' }}
                  />
                  <label htmlFor="wlanTerms" className="text-xs cursor-pointer" style={{ color: '#1a1a1a' }}>
                    {t(
                      'Ich habe die WLAN-Nutzungsbedingungen gelesen und akzeptiere sie.',
                      'I have read and accept the WLAN terms and conditions.'
                    )}{' '}
                    <a href={WLAN_TERMS_URL} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#295A97' }}>
                      {t('Bedingungen ansehen', 'View terms')}
                    </a>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Library access - opt-in with terms */}
          <div className="flex items-start gap-3 rounded p-3" style={{ backgroundColor: libraryChecked ? '#fffde7' : '#f5f5f5' }}>
            <input
              id="libraryAccess"
              name="libraryAccess"
              type="checkbox"
              checked={libraryChecked}
              onChange={(e) => { setLibraryChecked(e.target.checked); if (!e.target.checked) setLibraryTerms(false) }}
              className="mt-1 h-4 w-4 shrink-0 rounded"
              style={{ accentColor: '#9FBF47' }}
            />
            <div>
              <label htmlFor="libraryAccess" className="text-sm font-semibold cursor-pointer" style={{ color: '#1a1a1a' }}>
                {t('Bibliothekszugang (ULB)', 'Library Access (ULB)')}
              </label>
              <p className="text-xs mt-1" style={{ color: '#5a5a5a' }}>
                {t(
                  'Zugang zur Universitats- und Landesbibliothek sowie zu allen Campusbibliotheken.',
                  'Access to the University Library (ULB) and all campus libraries.'
                )}
              </p>
              {libraryChecked && (
                <div className="mt-2 flex items-start gap-2">
                  <input
                    id="libraryTerms"
                    type="checkbox"
                    checked={libraryTerms}
                    onChange={(e) => setLibraryTerms(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 rounded"
                    style={{ accentColor: '#9FBF47' }}
                  />
                  <label htmlFor="libraryTerms" className="text-xs cursor-pointer" style={{ color: '#1a1a1a' }}>
                    {t(
                      'Ich habe die Bibliotheksnutzungsbedingungen gelesen und akzeptiere sie.',
                      'I have read and accept the library terms and conditions.'
                    )}{' '}
                    <a href={ULB_TERMS_URL} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#295A97' }}>
                      {t('Bedingungen ansehen', 'View terms')}
                    </a>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Mensa - automatic */}
          <div className="flex items-start gap-3 rounded p-3" style={{ backgroundColor: '#e8f5e9' }}>
            <svg className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#27ae60' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
                {t('Mensa-Zahlungen (NFC-Chip)', 'Mensa Payments (NFC Chip)')}
              </p>
              <p className="text-xs" style={{ color: '#5a5a5a' }}>
                {t(
                  'Automatisch enthalten. Die Gastekarte fungiert als Zahlungsmittel in allen Mensen und Cafeterien des Studentenwerks.',
                  'Automatically included. The guest card functions as a payment method in all canteens and cafeterias.'
                )}
              </p>
            </div>
          </div>

          {/* VPN - excluded */}
          <div className="flex items-start gap-3 rounded p-3" style={{ backgroundColor: '#fff5f5' }}>
            <XCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#e74c3c' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
                {t('Externer VPN-Zugang', 'External VPN Access')}
              </p>
              <p className="text-xs" style={{ color: '#5a5a5a' }}>
                {t(
                  'Nicht verfugbar. Externer VPN-Zugang ist fur Gaste rechtlich ausgeschlossen.',
                  'Not available. External VPN access is legally excluded for guests.'
                )}
              </p>
            </div>
          </div>

          {/* ULB info */}
          <div className="flex items-start gap-3 rounded p-3" style={{ backgroundColor: '#e3f2fd' }}>
            <BookOpen className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#295A97' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
                {t('Datenbank- und Forschungszugang', 'Database & Research Access')}
              </p>
              <p className="text-xs" style={{ color: '#5a5a5a' }}>
                {t(
                  'Zugang zu elektronischen Datenbanken und Forschungsressourcen ist ausschliealich vor Ort in der ULB moeglich.',
                  'Access to electronic databases and research resources is only available on-site at the ULB.'
                )}
              </p>
              <p className="text-xs mt-1" style={{ color: '#5a5a5a' }}>
                <strong>{t('Adresse:', 'Address:')}</strong>{' '}
                {t(
                  'Universitaets- und Landesbibliothek Sachsen-Anhalt, August-Bebel-Strasse 13, 06108 Halle (Saale)',
                  'University and State Library Saxony-Anhalt, August-Bebel-Strasse 13, 06108 Halle (Saale)'
                )}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#5a5a5a' }}>
                <strong>{t('Öffnungszeiten:', 'Opening Hours:')}</strong>{' '}
                {t(
                  'Mo-Fr 08:00-22:00, Sa-So 10:00-20:00',
                  'Mon-Fri 08:00-22:00, Sat-Sun 10:00-20:00'
                )}
              </p>
            </div>
          </div>
        </div>
      </fieldset>

      <SubmitButton disabled={false} />
    </form>
  )
}
