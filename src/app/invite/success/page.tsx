'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { use } from 'react'

export default function InviteSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; email: string }>
}) {
  const { id, email } = use(searchParams)
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="rounded border p-8" style={{ backgroundColor: '#E8EAE5', borderColor: '#9FBF47' }}>
        <h1 className="mb-2 text-xl font-bold" style={{ color: '#252C27' }}>
          {t('Einladung gesendet', 'Invitation Sent')}
        </h1>
        <p className="mb-2 text-sm" style={{ color: '#1a1a1a' }}>
          {t(
            'Eine Einladung wurde an die folgende E-Mail-Adresse gesendet:',
            'An invitation has been sent to the following email address:'
          )}
        </p>
        <p className="mb-4 font-semibold text-sm" style={{ color: '#295A97' }}>{decodeURIComponent(email)}</p>
        <p className="mb-6 text-xs" style={{ color: '#5a5a5a' }}>
          {t(
            'Der Gast erhalt einen Link, um seine Daten zu vervollständigen. Sie werden benachrichtigt, sobald der Gast sein Profil ausgefüllt hat.',
            'The guest will receive a link to complete their details. You will be notified once the guest has filled out their profile.'
          )}
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
        >
          {t('Zum Dashboard', 'Go to Dashboard')}
        </Link>
      </div>
    </div>
  )
}
