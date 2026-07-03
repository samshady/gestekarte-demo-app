'use client'

import { useLanguage } from '@/lib/language'
import { useRole } from '@/lib/role'
import { inviteGuest } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFormStatus } from 'react-dom'

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
      {pending ? t('Wird gesendet...', 'Sending...') : t('Einladung senden', 'Send Invitation')}
    </Button>
  )
}

export default function InvitePage() {
  const { t } = useLanguage()
  const { role } = useRole()

  if (role !== 'ROLE_HOST') {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-sm" style={{ color: '#e74c3c' }}>
          {t('Nur Hosts können Einladungen versenden.', 'Only hosts can send invitations.')}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold" style={{ color: '#1a1a1a' }}>
        {t('Gast einladen', 'Invite a Guest')}
      </h1>
      <p className="mb-6 text-sm" style={{ color: '#5a5a5a' }}>
        {t(
          'Füllen Sie dieses Formular aus, um einen internationalen Gast einzuladen. Der Gast erhält eine E-Mail mit einem Link, um seine Daten zu vervollständigen.',
          'Fill out this form to invite an international guest. The guest will receive an email with a link to complete their details.'
        )}
      </p>

      <div
        className="mb-6 rounded border p-3 text-xs leading-relaxed"
        style={{ backgroundColor: '#eef3fa', borderColor: '#295A97', color: '#1a1a1a' }}
      >
        <strong>{t('Hinweis:', 'Notice:')}</strong>{' '}
        {t(
          'Bitte laden Sie den Gast mindestens 14 Tage vor dessen Anreise ein. Die maximale Aufenthaltsdauer beträgt ein Semester (ca. 6 Monate).',
          'Please invite the guest at least 14 days before their arrival. The maximum stay duration is one semester (approx. 6 months).'
        )}
      </div>

      <form action={inviteGuest} className="space-y-6">
        {/* Guest info */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
              {t('Gastinformationen', 'Guest Information')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="guestEmail" style={{ color: '#1a1a1a' }}>
                {t('E-Mail-Adresse des Gasts', 'Guest Email Address')}
              </Label>
              <Input id="guestEmail" name="guestEmail" type="email" required placeholder="gast@example.com" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="arrivalDate" style={{ color: '#1a1a1a' }}>
                  {t('Anreisedatum', 'Arrival Date')}
                </Label>
                <Input id="arrivalDate" name="arrivalDate" type="date" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="departureDate" style={{ color: '#1a1a1a' }}>
                  {t('Abreisedatum', 'Departure Date')}
                </Label>
                <Input id="departureDate" name="departureDate" type="date" required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Host details */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
              {t('Angaben zum Betreuer (Host)', 'Host Details')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="hostSalutation" style={{ color: '#1a1a1a' }}>
                {t('Anrede', 'Salutation')}
              </Label>
              <select
                id="hostSalutation"
                name="hostSalutation"
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
              <Label htmlFor="hostName" style={{ color: '#1a1a1a' }}>
                {t('Vor- und Nachname', 'First and Last Name')}
              </Label>
              <Input id="hostName" name="hostName" required placeholder="Prof. Dr. ..." />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hostEmail" style={{ color: '#1a1a1a' }}>
                {t('E-Mail', 'Email')}
              </Label>
              <Input id="hostEmail" name="hostEmail" type="email" placeholder="betreuer@uni-halle.de" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hostFaculty" style={{ color: '#1a1a1a' }}>
                {t('Fakultät / Institut', 'Faculty / Institute')}
              </Label>
              <Input id="hostFaculty" name="hostFaculty" placeholder="z.B. Naturwissenschaftliche Fakultät III" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="hostPhone" style={{ color: '#1a1a1a' }}>
                  {t('Diensttelefon', 'Office Phone')}
                </Label>
                <Input id="hostPhone" name="hostPhone" type="tel" placeholder="+49 345 55 ..." />
              </div>
              <div className="space-y-1">
                <Label htmlFor="costCenter" style={{ color: '#1a1a1a' }}>
                  {t('Kostenstelle', 'Cost Center')}
                </Label>
                <Input id="costCenter" name="costCenter" placeholder="z.B. 12345" />
              </div>
            </div>
          </CardContent>
        </Card>

        <SubmitButton />
      </form>
    </div>
  )
}
