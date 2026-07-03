'use client'

import { useLanguage } from '@/lib/language'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#1a1a1a' }}>
          {t('Über das Projekt', 'About the Project')}
        </h1>
      </div>

      {/* Main Section */}
      <section className="mx-auto max-w-2xl text-center mb-12 border p-6 rounded" style={{ borderColor: '#d0d3cc', backgroundColor: '#F7F8F5' }}>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#252C27' }}>
          Projektseminar Informationsmanagement · SS-26
        </h2>
        <h3 className="text-base font-bold mb-4" style={{ color: '#9FBF47' }}>
          {t('Gästekarteprozess Optimierung', 'Guest Card Process Optimization')}
        </h3>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: '#5a5a5a' }}>
          {t('Dieses Projekt entstand im Rahmen des Projektseminars Informationsmanagement im Sommersemester 2026 an der Martin-Luther-Universität Halle-Wittenberg.', 'This project was created as part of the Information Management project seminar in the summer semester of 2026 at the Martin Luther University Halle-Wittenberg.')}
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: '#5a5a5a' }}>
          {t('Ziel ist die Digitalisierung und Optimierung des Gästekartenprozesses für internationale und nationale Gäste, Hosts, das International Office (IO), das ITZ und die ULB. Durch den Abbau von Medienbrüchen und redundanten Papierformularen soll eine moderne, benutzerfreundliche und zentrale Plattform geschaffen werden.', 'The goal is the digitization and optimization of the guest card process for international and national guests, hosts, the International Office (IO), the ITZ, and the ULB. By reducing media breaks and redundant paper forms, a modern, user-friendly, and central platform will be created.')}
        </p>
      </section>

      {/* Lists Row */}
      <section className="mx-auto max-w-2xl mt-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Team Box */}
          <div className="rounded border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}>
            <h4 className="text-sm font-bold border-b pb-2 mb-3" style={{ color: '#252C27', borderColor: '#d0d3cc' }}>
              {t('Das Team', 'The Team')}
            </h4>
            <ul className="text-sm space-y-2" style={{ color: '#5a5a5a' }}>
              <li>• Doaa Al-Shoumi</li>
              <li>• Amy Müller</li>
              <li>• Jenna Peters</li>
              <li>• Sameer Rana</li>
              <li>• Jacy Richter</li>
            </ul>
          </div>

          {/* Supervisors Box */}
          <div className="rounded border p-4" style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}>
            <h4 className="text-sm font-bold border-b pb-2 mb-3" style={{ color: '#252C27', borderColor: '#d0d3cc' }}>
              {t('Betreuer', 'Supervisors')}
            </h4>
            <ul className="text-sm space-y-2" style={{ color: '#5a5a5a' }}>
              <li>• Sebastian Hirsekorn</li>
              <li>• Leonard Nake</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
