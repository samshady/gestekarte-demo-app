'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language'

export default function GuestCompleteSuccessPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="rounded border p-8" style={{ backgroundColor: '#E8EAE5', borderColor: '#9FBF47' }}>
        <h1 className="mb-2 text-xl font-bold" style={{ color: '#252C27' }}>
          {t('Angaben übermittelt', 'Details Submitted')}
        </h1>
        <p className="mb-4 text-sm" style={{ color: '#1a1a1a' }}>
          {t(
            'Vielen Dank! Ihre Angaben wurden an Ihren Betreuer weitergeleitet. Sie erhalten eine Benachrichtigung, sobald der Antrag bearbeitet wurde.',
            'Thank you! Your details have been forwarded to your host. You will be notified once the application has been processed.'
          )}
        </p>
        <Link
          href="/status"
          className="inline-block rounded px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
        >
          {t('Status prüfen', 'Check Status')}
        </Link>
      </div>
    </div>
  )
}
