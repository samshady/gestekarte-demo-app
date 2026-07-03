'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { ImageCarousel } from '@/components/ImageCarousel'

const halleImages = [
  { src: '/site-assets/Halle/halle_csm-marktplatz-abend.jpg', alt: 'Marktplatz Halle' },
  { src: '/site-assets/Halle/halle_csm-saale-burg-giebichenstein-003.jpg', alt: 'Saale und Burg Giebichenstein' },
  { src: '/site-assets/Halle/halle_csm-haendelhaus.jpg', alt: 'Handelhaus' },
  { src: '/site-assets/Halle/halle_csm-roter-turm-uhr.jpg', alt: 'Roter Turm' },
  { src: '/site-assets/Halle/halle_csm-dom-2021.jpg', alt: 'Dom zu Halle' },
  { src: '/site-assets/Halle/halle_csm-leopoldina-nationale-akademie-der-wissenschaften-c-thomas-ziegler-stadt-halle-saale.jpg', alt: 'Leopoldina' },
  { src: '/site-assets/Halle/halle_csm-opernhaus.jpg', alt: 'Opernhaus' },
  { src: '/site-assets/Halle/halle_csm-landesmuseum-himmelsscheibe.jpg', alt: 'Landesmuseum Himmelsscheibe' },
  { src: '/site-assets/Halle/halle_csm-moritzkirche-panorama.jpg', alt: 'Moritzkirche' },
  { src: '/site-assets/Halle/halle_csm-universitaet-studenten-025-1.jpg', alt: 'Universitat Studenten' },
  { src: '/site-assets/Halle/kunstmuseum-moritzburg-halle-122-resimage_v-variantBig16x9_w-704.avif', alt: 'Kunstmuseum Moritzburg' },
  { src: '/site-assets/Halle/halle-loewengebaeude-universitaetsplatz-102-resimage_v-variantBig16x9_w-704.avif', alt: 'Lowengebaude' },
  { src: '/site-assets/Halle/mdraktuell-marktplatz-halle-102-resimage_v-variantBig16x9_w-704.avif', alt: 'Marktplatz Halle' },
  { src: '/site-assets/Halle/halle-744-resimage_v-variantBig16x9_w-704.avif', alt: 'Halle Stadtansicht' },
  { src: '/site-assets/Halle/halle_csm-stadthaus.jpg', alt: 'Stadthaus' },
  { src: '/site-assets/Halle/halle_csm-hallmarkt-vor-2017-1500x1000px-645ad11724.jpg', alt: 'Hallmarkt' },
  { src: '/site-assets/Halle/halle_csm-haeuser-luftbild-j7a5499.jpg', alt: 'Luftbild Hauser' },
  { src: '/site-assets/Halle/halle_csm-blick-zum-ratshof-haendeldenkmal.jpg', alt: 'Ratshof Handeldenkmal' },
  { src: '/site-assets/Halle/halle_csm-riebeckplatz-2010.jpg', alt: 'Riebeckplatz' },
  { src: '/site-assets/Halle/halle_csm-mg-4860.jpg', alt: 'Stadtansicht' },
]

const mluImages = [
  { src: '/site-assets/MLU/mlu_csm-universitaet-loewengebaeude8-1.jpg', alt: 'Lowengebaude Universitat' },
  { src: '/site-assets/MLU/mlu_mlu-steintorcampus-david-koester-11.jpg', alt: 'Steintor Campus' },
  { src: '/site-assets/MLU/mlu_1370356983-1938-0.jpg', alt: 'Universitat' },
  { src: '/site-assets/MLU/mlu_1401277218-1938-00-800.jpg', alt: 'Universitat' },
  { src: '/site-assets/MLU/mlu_1428925172-2196-00-800.jpg', alt: 'Universitat' },
  { src: '/site-assets/MLU/mlu_1494331079-1864-0.jpg', alt: 'Universitat' },
]

const ioImage = { src: '/site-assets/IO/io_io-team.jpg', alt: 'IO Team' }

const gfhImages = [
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-3raum-doppelbettzimmer.jpg', alt: 'Georg-Forster-Haus Doppelbettzimmer' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-mosaik-01.jpg', alt: 'Georg-Forster-Haus Mosaik' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-pavillon-aussen-02.jpg', alt: 'Georg-Forster-Haus Pavillon' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-gemeinschaftsraum.jpg', alt: 'Georg-Forster-Haus Gemeinschaftsraum' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-2raum-maisonette.jpg', alt: 'Georg-Forster-Haus Maisonette' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-gemeinschaftskueche-01.jpg', alt: 'Georg-Forster-Haus Gemeinschaftskuche' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-gemeinschaftsraum-aussenbereich.jpg', alt: 'Georg-Forster-Haus Aussenbereich' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-seminarraum-01.jpg', alt: 'Georg-Forster-Haus Seminarraum' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-rollstuhlgerechtes-appartment.jpg', alt: 'Georg-Forster-Haus Rollstuhlappartment' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-3raum-einzelbettzimmer.jpg', alt: 'Georg-Forster-Haus Einzelbettzimmer' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-3raum-bad.jpg', alt: 'Georg-Forster-Haus Bad' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-bad-rollstuhlgerechtes-appartment.jpg', alt: 'Georg-Forster-Haus Rollstuhlgerechtes Bad' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-waschraum-02.jpg', alt: 'Georg-Forster-Haus Waschraum' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-gemeinschaftsraum-03.jpg', alt: 'Georg-Forster-Haus Gemeinschaftsraum' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-mosaik-02.jpg', alt: 'Georg-Forster-Haus Mosaik' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-mosaik-auschnitt.jpg', alt: 'Georg-Forster-Haus Mosaik Ausschnitt' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_jmp-7404-ibz-teekueche.jpg', alt: 'Georg-Forster-Haus Teekuche' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_kaffeetafel.jpg', alt: 'Georg-Forster-Haus Kaffeetafel' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_muffins.jpg', alt: 'Georg-Forster-Haus Muffins' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_sommerfest-buffet.jpg', alt: 'Georg-Forster-Haus Sommerfest Buffet' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_sommerfest-raum.jpg', alt: 'Georg-Forster-Haus Sommerfest Raum' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_sommerfest-tischbild.jpg', alt: 'Georg-Forster-Haus Sommerfest Tisch' },
  { src: '/site-assets/Georg_Forster_Haus/georg-forster-haus_ibz-rollstuhlgerechtes-appartment-02.jpg', alt: 'Georg-Forster-Haus Rollstuhlappartment' },
]

const ulbImages = [
  { src: '/site-assets/ULB/ulb_neubau.jpg', alt: 'ULB Neubau' },
  { src: '/site-assets/ULB/ulb_lesesaal-ha27.jpg', alt: 'ULB Lesesaal' },
  { src: '/site-assets/ULB/ulb_information2.jpg', alt: 'ULB Information' },
  { src: '/site-assets/ULB/ulb_foyer-luther-in-love.jpg', alt: 'ULB Foyer' },
  { src: '/site-assets/ULB/ulb_buchscanner-2.jpg', alt: 'ULB Buchscanner' },
  { src: '/site-assets/ULB/ulb_ha004-1.jpg', alt: 'ULB' },
  { src: '/site-assets/ULB/ulb_ha006-4.jpg', alt: 'ULB' },
  { src: '/site-assets/ULB/ulb_ha010-4.jpg', alt: 'ULB' },
  { src: '/site-assets/ULB/ulb_ha010-8.jpg', alt: 'ULB' },
  { src: '/site-assets/ULB/ulb_ha018-11.jpg', alt: 'ULB' },
  { src: '/site-assets/ULB/ulb_ha-1-2-2-kopie.jpg', alt: 'ULB' },
  { src: '/site-assets/ULB/ulb_ha150-1.jpg', alt: 'ULB' },
  { src: '/site-assets/ULB/ulb_ha179-3.jpg', alt: 'ULB' },
  { src: '/site-assets/ULB/ulb_juridicum-der-uni-halle-simone-friese.jpg', alt: 'ULB Juridicum' },
  { src: '/site-assets/ULB/ulb_leihgaben.jpg', alt: 'ULB Leihgaben' },
  { src: '/site-assets/ULB/ulb_nachlaesse.jpg', alt: 'ULB Nachlasse' },
  { src: '/site-assets/ULB/ulb_rechtswissenschaft-1.jpg', alt: 'ULB Rechtswissenschaft' },
  { src: '/site-assets/ULB/ulb_rechtswissenschaft-2.jpg', alt: 'ULB Rechtswissenschaft' },
  { src: '/site-assets/ULB/ulb_sammlung-alvensleben.jpg', alt: 'ULB Sammlung Alvensleben' },
  { src: '/site-assets/ULB/ulb_ulbmagazinhaus50.jpg', alt: 'ULB Magazinhaus' },
  { src: '/site-assets/ULB/ulb_wiso-start.jpg', alt: 'ULB WiSo' },
  { src: '/site-assets/ULB/ulb_wiso-suche.jpg', alt: 'ULB WiSuche' },
  { src: '/site-assets/ULB/ulb_zweigbibliothek-klassische-altertumswissenschaften-uni-halle-simone-friese.jpg', alt: 'ULB Zweigbibliothek' },
  { src: '/site-assets/ULB/ulb_bebilderung-dmg.jpg', alt: 'ULB DMG' },
  { src: '/site-assets/ULB/ulb_bebilderung-erziehungswissenschaften.jpg', alt: 'ULB Erziehungswissenschaften' },
  { src: '/site-assets/ULB/ulb_bebilderung-geowissenschaften-2.jpg', alt: 'ULB Geowissenschaften' },
  { src: '/site-assets/ULB/ulb_bebilderung-indogermanistik.jpg', alt: 'ULB Indogermanistik' },
  { src: '/site-assets/ULB/ulb_bebilderung-medienkommunikationswissenschaft.jpg', alt: 'ULB Medienkommunikationswissenschaft' },
  { src: '/site-assets/ULB/ulb_foto-fuer-uebersichtsseite-sammlungen-2.jpg', alt: 'ULB Ubersichtsseite Sammlungen' },
]

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#1a1a1a' }}>
          {t('Willkommen in Halle!', 'Welcome to Halle!')}
        </h1>
        <p className="mt-3 text-lg" style={{ color: '#5a5a5a' }}>
          {t(
            'Martin-Luther-Universitat Halle-Wittenberg',
            'Martin Luther University Halle-Wittenberg'
          )}
        </p>
      </div>

      {/* ===== SECTION 1: About Halle ===== */}
      <section className="mx-auto mt-10 max-w-2xl">
        <h2 className="mb-4 text-lg font-bold" style={{ color: '#252C27' }}>
          {t('Halle (Saale) entdecken', 'Discover Halle (Saale)')}
        </h2>

        <ImageCarousel images={halleImages} height={280} />

        <p className="mt-4 text-sm leading-relaxed" style={{ color: '#5a5a5a' }}>
          {t(
            'Die Stadt Halle liegt im Herzen Sachsen-Anhalts und vereint eine reiche Geschichte mit einer lebendigen Kulturlandschaft. Von der historischen Altstadt uber die Saale bis hin zu den zahlreichen Parks und Forschungsinstituten bietet Halle eine inspirierende Umgebung fur Wissenschaft und Austausch.',
            'The city of Halle lies in the heart of Saxony-Anhalt, blending a rich history with a vibrant cultural scene. From the historic old town along the Saale river to the numerous parks and research institutes, Halle offers an inspiring environment for scholarship and exchange.'
          )}
        </p>
      </section>

      {/* ===== SECTION 2: University & Facilities ===== */}
      <section className="mx-auto mt-14 max-w-2xl">
        <h2 className="mb-4 text-lg font-bold" style={{ color: '#252C27' }}>
          {t('Universitat & Einrichtungen', 'University & Facilities')}
        </h2>

        {/* Quick facts */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded border p-4 text-center" style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}>
            <p className="text-2xl font-bold" style={{ color: '#295A97' }}>{t('~20.000', '~20,000')}</p>
            <p className="mt-1 text-xs" style={{ color: '#5a5a5a' }}>{t('Studierende', 'Students')}</p>
          </div>
          <div className="rounded border p-4 text-center" style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}>
            <p className="text-2xl font-bold" style={{ color: '#295A97' }}>{t('~350', '~350')}</p>
            <p className="mt-1 text-xs" style={{ color: '#5a5a5a' }}>{t('Jahre Tradition', 'Years of Tradition')}</p>
          </div>
          <div className="rounded border p-4 text-center" style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}>
            <p className="text-2xl font-bold" style={{ color: '#295A97' }}>{t('9', '9')}</p>
            <p className="mt-1 text-xs" style={{ color: '#5a5a5a' }}>{t('Fakultaten', 'Faculties')}</p>
          </div>
        </div>

        {/* Welcome message */}
        <div
          className="mb-6 rounded border p-6 text-center"
          style={{ borderColor: '#d0d3cc', backgroundColor: '#F7F8F5' }}
        >
          <h3 className="text-base font-bold" style={{ color: '#252C27' }}>
            {t('Herzlich willkommen, liebe Gaste!', 'A warm welcome, dear guests!')}
          </h3>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: '#5a5a5a' }}>
            {t(
              'Die Martin-Luther-Universitat Halle-Wittenberg heisst Sie herzlich willkommen. Uber unser digitales Gastekartenportal konnen Sie Ihre Gastekarte beantragen, den Aufenthalt verlängern und Ihre Dienste verwalten.',
              'MLU Halle-Wittenberg warmly welcomes you. Through our digital guest card portal you can apply for your guest card, extend your stay, and manage your services.'
            )}
          </p>
        </div>

        {/* Cards row */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* University */}
          <div className="rounded border" style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}>
            <ImageCarousel images={mluImages} height={160} smallDots className="rounded-t-lg overflow-hidden" />
            <div className="p-4">
              <h4 className="text-sm font-bold" style={{ color: '#252C27' }}>
                {t('Universitat', 'University')}
              </h4>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: '#5a5a5a' }}>
                {t(
                  'Die MLU ist eine der altesten Universitaten Deutschlands mit rund 20.000 Studierenden und neun Fakultaten.',
                  'MLU is one of the oldest universities in Germany with around 20,000 students and nine faculties.'
                )}
              </p>
              <a
                href="https://www.uni-halle.de"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#9FBF47', color: '#252C27' }}
              >
                {t('Webseite besuchen', 'Visit Website')} ↗
              </a>
            </div>
          </div>

          {/* International Office */}
          <div className="rounded border" style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}>
            <ImageCarousel images={[ioImage]} height={160} smallDots className="rounded-t-lg overflow-hidden" />
            <div className="p-4">
              <h4 className="text-sm font-bold" style={{ color: '#252C27' }}>
                {t('International Office', 'International Office')}
              </h4>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: '#5a5a5a' }}>
                {t(
                  'Das International Office unterstutzt internationale Gaste und Forschende bei allen Fragen rund um den Aufenthalt an der MLU.',
                  'The International Office supports international guests and researchers with all questions regarding their stay at MLU.'
                )}
              </p>
              <a
                href="https://www.international.uni-halle.de/international_office/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#9FBF47', color: '#252C27' }}
              >
                {t('Webseite besuchen', 'Visit Website')} ↗
              </a>
            </div>
          </div>

          {/* Georg-Forster-Haus */}
          <div className="rounded border" style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}>
            <ImageCarousel images={gfhImages} height={160} smallDots className="rounded-t-lg overflow-hidden" />
            <div className="p-4">
              <h4 className="text-sm font-bold" style={{ color: '#252C27' }}>
                {t('Georg-Forster-Haus (Gastehaus)', 'Georg-Forster-Haus (Guest House)')}
              </h4>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: '#5a5a5a' }}>
                {t(
                  'Das Georg-Forster-Haus bietet modern ausgestattete Apartments und Buros fur internationale Gastwissenschaftler in unmittelbarer Nahe zum Campus.',
                  'The Georg-Forster-Haus offers modern apartments and offices for international guest researchers in close proximity to the campus.'
                )}
              </p>
              <a
                href="https://ibz.uni-halle.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#9FBF47', color: '#252C27' }}
              >
                {t('Webseite besuchen', 'Visit Website')} ↗
              </a>
            </div>
          </div>

          {/* ULB */}
          <div className="rounded border" style={{ backgroundColor: '#FFFFFF', borderColor: '#d0d3cc' }}>
            <ImageCarousel images={ulbImages} height={160} smallDots className="rounded-t-lg overflow-hidden" />
            <div className="p-4">
              <h4 className="text-sm font-bold" style={{ color: '#252C27' }}>
                {t('ULB Bibliothek', 'ULB Library')}
              </h4>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: '#5a5a5a' }}>
                {t(
                  'Die Universitats- und Landesbibliothek Sachsen-Anhalt bietet umfangreiche Literatur- und Forschungsressourcen fur Wissenschaftler und Studierende.',
                  'The University and State Library Saxony-Anhalt offers extensive literature and research resources for scholars and students.'
                )}
              </p>
              <a
                href="https://bibliothek.uni-halle.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#9FBF47', color: '#252C27' }}
              >
                {t('Webseite besuchen', 'Visit Website')} ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <div className="mx-auto mt-14 max-w-2xl text-center">
        <h2 className="text-lg font-bold" style={{ color: '#252C27' }}>
          {t('Bereit loszulegen?', 'Ready to get started?')}
        </h2>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/apply?mode=new"
            className="rounded px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#9FBF47', color: '#252C27' }}
          >
            {t('Gastekarte beantragen', 'Apply for Guest Card')}
          </Link>
          <Link
            href="/apply?mode=extend"
            className="rounded px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#E8EAE5', color: '#1a1a1a', border: '1px solid #d0d3cc' }}
          >
            {t('Aufenthalt verlängern', 'Extend Your Stay')}
          </Link>
        </div>
      </div>
    </div>
  )
}
