'use client'

import { use, useState } from 'react'
import { useLanguage } from '@/lib/language'
import { ApplyForm } from './ApplyForm'
import { ExtendForm } from './ExtendForm'

export default function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode: initialMode } = use(searchParams)
  const { t } = useLanguage()
  const [mode, setMode] = useState<'new' | 'extend'>(initialMode === 'extend' ? 'extend' : 'new')

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold" style={{ color: '#1a1a1a' }}>
        {mode === 'new'
          ? t('Gastekartenantrag', 'Guest Card Application')
          : t('Karte verlängern', 'Extend Card')}
      </h1>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setMode('new')}
          className="rounded px-4 py-2 text-sm font-semibold transition-colors"
          style={{
            backgroundColor: mode === 'new' ? '#9FBF47' : '#E8EAE5',
            color: '#252C27',
            border: mode === 'new' ? 'none' : '1px solid #d0d3cc',
          }}
        >
          {t('Neuer Antrag', 'New Application')}
        </button>
        <button
          onClick={() => setMode('extend')}
          className="rounded px-4 py-2 text-sm font-semibold transition-colors"
          style={{
            backgroundColor: mode === 'extend' ? '#9FBF47' : '#E8EAE5',
            color: '#252C27',
            border: mode === 'extend' ? 'none' : '1px solid #d0d3cc',
          }}
        >
          {t('Verlängern', 'Extend')}
        </button>
      </div>

      {mode === 'new' ? <ApplyForm /> : <ExtendForm />}
    </div>
  )
}
