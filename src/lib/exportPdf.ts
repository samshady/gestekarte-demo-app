import { jsPDF } from 'jspdf'

interface ExportData {
  guestName: string
  guestEmail: string
  dateOfBirth: Date | string
  hostName: string
  homeAddress: string
  halleAddress: string
  arrivalDate: Date | string
  departureDate: Date | string
  status: string
  wlanAccess?: boolean
  libraryAccess?: boolean
  mensaPayments?: boolean
  databaseAccess?: boolean
  referenceNumber?: string | null
  guestSignedAt?: string | null
  hostSignedAt?: string | null
  hostSignature?: string | null
  wlanProvisioned?: boolean
  libraryProvisioned?: boolean
}

function fmt(d: Date | string, locale: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString(locale)
}

export function generatePdf(
  data: ExportData,
  t: (de: string, en: string) => string,
  lang: string
) {
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'
  const statusLabel =
    data.status === 'INVITED'
      ? t('Eingeladen', 'Invited')
      : data.status === 'PENDING_HOST'
      ? t('Ausstehend', 'Pending')
      : data.status === 'APPROVED'
      ? t('Genehmigt', 'Approved')
      : data.status === 'DEACTIVATED'
      ? t('Deaktiviert', 'Deactivated')
      : data.status === 'REJECTED'
      ? t('Abgelehnt', 'Rejected')
      : t('Abgelaufen', 'Expired')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = 210
  const margin = 20
  const x = margin
  let y = margin + 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(t('Gastantrag', 'Guest Application'), x, y)
  y += 8

  doc.setDrawColor(159, 191, 71)
  doc.setLineWidth(0.8)
  doc.line(x, y, pageW - margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(90, 90, 90)
  doc.text(
    `${t('Referenznummer', 'Reference Number')}: ${data.referenceNumber ?? '---'}    ${t('Status', 'Status')}: ${statusLabel}`,
    x,
    y
  )
  y += 6

  const ref = data.referenceNumber ?? data.guestName?.replace(/\s+/g, '-') ?? 'antrag'

  const rows: [string, string][] = [
    [t('Name', 'Name'), data.guestName || '-'],
    ['E-Mail', data.guestEmail || '-'],
    [t('Geburtsdatum', 'Date of Birth'), fmt(data.dateOfBirth, locale)],
    [t('Betreuer', 'Host'), data.hostName || '-'],
    [t('Heimatadresse', 'Home Address'), data.homeAddress || '-'],
    [t('Adresse in Halle', 'Address in Halle'), data.halleAddress || '-'],
    [t('Anreise', 'Arrival'), fmt(data.arrivalDate, locale)],
    [t('Abreise', 'Departure'), fmt(data.departureDate, locale)],
  ]

  if (data.status !== 'PENDING_HOST' && data.status !== 'INVITED' && data.wlanAccess !== undefined) {
    rows.push(['', ''])
    rows.push([t('Dienstleistungen / Services', 'Services'), ''])
    rows.push(['', ''])
    rows.push(['WLAN', data.wlanAccess ? t('Aktiv', 'Active') : t('Inaktiv', 'Inactive')])
    rows.push([t('Bibliothek', 'Library'), data.libraryAccess ? t('Aktiv', 'Active') : t('Inaktiv', 'Inactive')])
    rows.push([t('Mensa', 'Mensa'), data.mensaPayments ? t('Aktiv', 'Active') : t('Inaktiv', 'Inactive')])
    rows.push([t('Datenbank', 'Database'), data.databaseAccess ? t('Aktiv', 'Active') : t('Inaktiv', 'Inactive')])

    if (data.wlanProvisioned !== undefined) {
      rows.push([t('WLAN bereitgestellt', 'WLAN Provisioned'), data.wlanProvisioned ? t('Ja', 'Yes') : t('Nein', 'No')])
      rows.push([t('Bibliothek bereitgestellt', 'Library Provisioned'), data.libraryProvisioned ? t('Ja', 'Yes') : t('Nein', 'No')])
    }
  }

  // Signatures section
  rows.push(['', ''])
  rows.push([t('Unterschriften', 'Signatures'), ''])
  rows.push(['', ''])
  rows.push([t('Gast unterschrieben am', 'Guest signed at'), data.guestSignedAt ? fmt(data.guestSignedAt, locale) : '-'])
  rows.push([t('Host unterschrieben am', 'Host signed at'), data.hostSignedAt ? fmt(data.hostSignedAt, locale) : '-'])
  rows.push([t('Host Unterschrift', 'Host Signature'), data.hostSignature || '-'])

  doc.setFontSize(9)
  for (const [label, value] of rows) {
    if (!label && !value) {
      y += 5
      continue
    }
    if (label === t('Dienstleistungen / Services', 'Services') || label === t('Unterschriften', 'Signatures')) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      y += 6
      doc.text(label, x, y)
      y += 4
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      continue
    }
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(90, 90, 90)
    doc.text(label, x, y)
    const labelW = doc.getTextWidth(label)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(26, 26, 26)
    doc.text(value, x + labelW + 4, y)
    y += 5

    if (y > 275) {
      doc.addPage()
      y = margin + 10
    }
  }

  y = Math.max(y + 8, 275)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(146, 135, 129)
  doc.text(
    `${t('Exportiert am', 'Exported on')} ${new Date().toLocaleDateString(locale)}  ·  MLU Halle Gastekartenportal`,
    pageW / 2,
    y,
    { align: 'center' }
  )

  doc.save(`gastantrag-${ref}.pdf`)
}
