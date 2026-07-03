'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { use } from 'react'

export default function ApplySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; appNum?: string }>
}) {
  const { id, appNum } = use(searchParams)
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div
        className="rounded border p-8"
        style={{ backgroundColor: '#E8EAE5', borderColor: '#9FBF47' }}
      >
        <h1 className="mb-2 text-xl font-bold" style={{ color: '#252C27' }}>
          {t('Antrag eingereicht', 'Application Submitted')}
        </h1>
        <p className="mb-4 text-sm" style={{ color: '#1a1a1a' }}>
          {t(
            'Ihr Antrag wurde erfolgreich ubermittelt. Der gastgebende Betreuer wird benachrichtigt, um die Genehmigung zu erteilen.',
            'Your application has been submitted successfully. The host will be notified for approval.'
          )}
        </p>
        {appNum && (
          <p className="mb-4 text-sm" style={{ color: '#1a1a1a' }}>
            {t('Ihre Antragsnummer', 'Your Application Number')}:{' '}
            <code className="font-mono font-bold text-base" style={{ color: '#295A97' }}>
              {appNum}
            </code>
          </p>
        )}
        <p className="mb-6 text-xs" style={{ color: '#5a5a5a' }}>
          {t(
            'Mit dieser Nummer konnen Sie den Status Ihres Antrags abfragen.',
            'Use this number to check your application status.'
          )}
        </p>
        <Link
          href="/status"
          className="mr-3 rounded px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
        >
          {t('Status prufen', 'Check Status')}
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold underline underline-offset-2"
          style={{ color: '#295A97' }}
        >
          {t('Zuruck zur Startseite', 'Back to Home')}
        </Link>
      </div>
    </div>
  )
}
