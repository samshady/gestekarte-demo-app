'use client'

import { useLanguage } from '@/lib/language'

const contacts = [
  {
    key: 'io',
    de: {
      name: 'International Office der MLU',
      address: 'Anton-Wilhelm-Amo-Strasse 19/20, 06108 Halle (Saale)',
      phone: '+49 345 55 21589',
      email: 'info@international.uni-halle.de',
      url: 'https://www.international.uni-halle.de/international_office/',
      hours: 'Mo-Do 09:00-16:00, Fr 09:00-14:00',
    },
    en: {
      name: 'International Office MLU',
      address: 'Anton-Wilhelm-Amo-Strasse 19/20, 06108 Halle (Saale)',
      phone: '+49 345 55 21589',
      email: 'info@international.uni-halle.de',
      url: 'https://www.international.uni-halle.de/international_office/',
      hours: 'Mon-Thu 09:00-16:00, Fri 09:00-14:00',
    },
  },
  {
    key: 'gfh',
    de: {
      name: 'Georg-Forster-Haus (Gastehaus)',
      description: 'Das Georg-Forster-Haus ist die zentrale Unterkunft fur internationale Gastwissenschaftler der MLU Halle-Wittenberg. Es bietet modern ausgestattete Apartments und Buros in unmittelbarer Nahe zum Campus.',
      address: 'Emil-Abderhalden-Strasse 7a, 06108 Halle (Saale)',
      phone: '+49 345 55 28350',
      email: 'info@ibz.uni-halle.de',
      url: 'https://ibz.uni-halle.de/',
    },
    en: {
      name: 'Georg-Forster-Haus (Guest House)',
      description: 'The Georg-Forster-Haus is the central accommodation for international guest researchers at MLU Halle-Wittenberg. It offers modern apartments and offices in close proximity to the campus.',
      address: 'Emil-Abderhalden-Strasse 7a, 06108 Halle (Saale)',
      phone: '+49 345 55 28350',
      email: 'info@ibz.uni-halle.de',
      url: 'https://ibz.uni-halle.de/',
    },
  },
  {
    key: 'ulb',
    de: {
      name: 'Universitats- und Landesbibliothek Sachsen-Anhalt (ULB)',
      address: 'August-Bebel-Strasse 13, 06108 Halle (Saale)',
      phone: '0345 55 22 166',
      email: 'auskunft@bibliothek.uni-halle.de',
      url: 'https://bibliothek.uni-halle.de/',
      hours: 'Mo-Fr 08:00-22:00, Sa-So 10:00-20:00',
    },
    en: {
      name: 'University and State Library Saxony-Anhalt (ULB)',
      address: 'August-Bebel-Strasse 13, 06108 Halle (Saale)',
      phone: '0345 55 22 166',
      email: 'auskunft@bibliothek.uni-halle.de',
      url: 'https://bibliothek.uni-halle.de/',
      hours: 'Mon-Fri 08:00-22:00, Sat-Sun 10:00-20:00',
    },
  },
  {
    key: 'uni',
    de: {
      name: 'Martin-Luther-Universitat Halle-Wittenberg',
      address: 'Universitatsplatz 10, 06108 Halle (Saale)',
      url: 'https://www.uni-halle.de/',
      facultiesUrl: 'https://www.uni-halle.de/fakultaeten/',
    },
    en: {
      name: 'Martin Luther University Halle-Wittenberg',
      address: 'Universitatsplatz 10, 06108 Halle (Saale)',
      url: 'https://www.uni-halle.de/',
      facultiesUrl: 'https://www.uni-halle.de/fakultaeten/',
    },
  },
]

export default function ContactPage() {
  const { t, lang } = useLanguage()
  const info = lang === 'de' ? 'de' : 'en'

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold" style={{ color: '#1a1a1a' }}>
        {t('Kontakt', 'Contact')}
      </h1>
      <p className="mb-8 text-sm" style={{ color: '#5a5a5a' }}>
        {t(
          'Hier finden Sie die wichtigsten Kontaktinformationen fur Ihren Aufenthalt an der Martin-Luther-Universitat Halle-Wittenberg.',
          'Here you will find the most important contact information for your stay at MLU Halle-Wittenberg.'
        )}
      </p>

      <div className="space-y-6">
        {contacts.map((c) => {
          const data = c[info]
          return (
            <div
              key={c.key}
              className="rounded border p-5"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}
            >
              <h2 className="mb-3 text-base font-bold" style={{ color: '#252C27' }}>
                {data.name}
              </h2>

              {'description' in data && data.description && (
                <p className="mb-3 text-sm" style={{ color: '#5a5a5a' }}>
                  {data.description}
                </p>
              )}

              {data.address && (
                <dl className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 font-semibold" style={{ color: '#5a5a5a' }}>
                      {t('Adresse', 'Address')}:
                    </dt>
                    <dd style={{ color: '#1a1a1a' }}>{data.address}</dd>
                  </div>
                  {data.phone && (
                    <div className="flex gap-2">
                      <dt className="w-28 shrink-0 font-semibold" style={{ color: '#5a5a5a' }}>
                        {t('Telefon', 'Phone')}:
                      </dt>
                      <dd style={{ color: '#1a1a1a' }}>{data.phone}</dd>
                    </div>
                  )}
                  {data.email && (
                    <div className="flex gap-2">
                      <dt className="w-28 shrink-0 font-semibold" style={{ color: '#5a5a5a' }}>
                        E-Mail:
                      </dt>
                      <dd>
                        <a
                          href={`mailto:${data.email}`}
                          className="underline underline-offset-2"
                          style={{ color: '#295A97' }}
                        >
                          {data.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {'hours' in data && data.hours && (
                    <div className="flex gap-2">
                      <dt className="w-28 shrink-0 font-semibold" style={{ color: '#5a5a5a' }}>
                        {t('Öffnungszeiten', 'Opening Hours')}:
                      </dt>
                      <dd style={{ color: '#1a1a1a' }}>{data.hours}</dd>
                    </div>
                  )}
                </dl>
              )}

              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block rounded px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#9FBF47', color: '#252C27' }}
              >
                {t('Webseite besuchen', 'Visit Website')} ↗
              </a>
              {'facultiesUrl' in data && data.facultiesUrl && (
                <a
                  href={data.facultiesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 ml-2 inline-block rounded px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
                >
                  {t('Fakultaten', 'Faculties')} ↗
                </a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
