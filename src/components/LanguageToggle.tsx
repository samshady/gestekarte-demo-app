'use client'

import { useLanguage } from '@/lib/language'

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => setLang('de')}
        className="px-2 py-0.5 rounded transition-colors"
        style={
          lang === 'de'
            ? { backgroundColor: '#9FBF47', color: '#252C27', fontWeight: 700 }
            : { color: '#5a5a5a' }
        }
        aria-label="Deutsch"
        aria-pressed={lang === 'de'}
      >
        DE
      </button>
      <span style={{ color: '#d0d3cc' }}>|</span>
      <button
        onClick={() => setLang('en')}
        className="px-2 py-0.5 rounded transition-colors"
        style={
          lang === 'en'
            ? { backgroundColor: '#9FBF47', color: '#252C27', fontWeight: 700 }
            : { color: '#5a5a5a' }
        }
        aria-label="English"
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  )
}