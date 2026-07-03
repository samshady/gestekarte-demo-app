'use client'

import { useLanguage } from '@/lib/language'
import Link from 'next/link'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer
      className="py-4 text-center flex flex-col gap-2 items-center justify-center text-xs"
      style={{ backgroundColor: '#252C27', color: '#d0d3cc', borderTop: '2px solid #9FBF47' }}
    >
      <div>
        Martin-Luther-Universitat Halle-Wittenberg | {t('Gästekartenportal', 'Guest Card Portal')}
      </div>
      <div>
        <Link href="/about" className="hover:text-white underline decoration-dashed underline-offset-2 transition-colors">
          {t('Über das Projekt', 'About')}
        </Link>
      </div>
    </footer>
  )
}
