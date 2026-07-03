'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ApprovalForm } from './ApprovalForm'
import { toggleService, deactivateCard, reactivateCard, rejectApplication } from './actions'
import { generatePdf } from '@/lib/exportPdf'
import { useLanguage } from '@/lib/language'
import { CheckCircle2, XCircle } from 'lucide-react'

interface ApplicationData {
  guestName: string
  guestEmail: string
  dateOfBirth: Date
  hostName: string
  hostSalutation?: string | null
  hostEmail?: string | null
  hostFaculty?: string | null
  hostPhone?: string | null
  costCenter?: string | null
  nationality?: string | null
  guestSalutation?: string | null
  homeAddress: string
  halleAddress: string
  arrivalDate: Date
  departureDate: Date
  status: string
  wlanAccess: boolean
  libraryAccess: boolean
  mensaPayments: boolean
  vpnAccess: boolean
  databaseAccess: boolean
  cardActive: boolean
  referenceNumber: string | null
  applicationNumber: string | null
  guestNumber: string | null
  wlanProvisioned: boolean
  libraryProvisioned: boolean
  guestSignedAt: Date | string | null
  hostSignedAt: Date | string | null
  hostSignature: string | null
}

type ToggleableService = 'wlanAccess' | 'libraryAccess'

function ServiceRow({
  label,
  active,
  canToggle,
  disabled,
  onToggle,
  description,
  extraInfo,
}: {
  label: string
  active: boolean
  canToggle?: boolean
  disabled?: boolean
  onToggle?: (v: boolean) => void
  description?: string
  extraInfo?: string
}) {
  const { t } = useLanguage()

  if (!canToggle) {
    return (
      <div
        className="flex items-center gap-3 rounded p-3 text-sm"
        style={{
          backgroundColor: active ? '#e8f5e9' : '#fff5f5',
          opacity: active ? 1 : 0.6,
        }}
      >
        {active
          ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: '#27ae60' }} />
          : <XCircle className="h-5 w-5 shrink-0" style={{ color: '#e74c3c' }} />
        }
        <div className="flex-1">
          <span className="font-semibold" style={{ color: '#1a1a1a' }}>{label}</span>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: '#5a5a5a' }}>{description}</p>
          )}
          {extraInfo && (
            <p className="text-xs mt-0.5 font-medium" style={{ color: '#e74c3c' }}>{extraInfo}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-3 rounded p-3 text-sm transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ backgroundColor: active ? '#e8f5e9' : '#f5f5f5' }}
      onClick={() => { if (!disabled) onToggle?.(!active) }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onToggle?.(!active) } }}
    >
      {active
        ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: '#27ae60' }} />
        : <div className="h-5 w-5 shrink-0 rounded-full border-2" style={{ borderColor: '#d0d3cc' }} />
      }
      <div className="flex-1">
        <span className="font-semibold" style={{ color: '#1a1a1a' }}>{label}</span>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: '#5a5a5a' }}>{description}</p>
        )}
        {extraInfo && (
          <p className="text-xs mt-0.5 font-medium" style={{ color: '#e74c3c' }}>{extraInfo}</p>
        )}
      </div>
      <span className="text-xs font-medium" style={{ color: active ? '#295A97' : '#5a5a5a' }}>
        {active ? t('Beantragt', 'Requested') : t('Nicht beantragt', 'Not requested')}
      </span>
    </div>
  )
}

export function ApprovalDetail({
  id,
  hostView = false,
  application,
}: {
  id: string
  hostView?: boolean
  application: ApplicationData
}) {
  const { t, lang } = useLanguage()
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'
  const isExpired = application.status === 'EXPIRED'
  const [services, setServices] = useState({
    wlanAccess: isExpired ? false : application.wlanAccess,
    libraryAccess: isExpired ? false : application.libraryAccess,
  })
  const [cardActive, setCardActive] = useState(isExpired ? false : application.cardActive)

  function effectiveWlan(): boolean {
    return services.wlanAccess && application.wlanProvisioned
  }
  function effectiveLibrary(): boolean {
    return services.libraryAccess && application.libraryProvisioned
  }

  function getStatusInfo(status: string) {
    const map: Record<string, { label: string; style: React.CSSProperties }> = {
      PENDING_HOST: {
        label: t('Ausstehend', 'Pending'),
        style: { backgroundColor: '#f5a623', color: '#1a1a1a' },
      },
      APPROVED: {
        label: t('Genehmigt', 'Approved'),
        style: { backgroundColor: '#27ae60', color: '#ffffff' },
      },
      EXPIRED: {
        label: t('Abgelaufen', 'Expired'),
        style: { backgroundColor: '#e74c3c', color: '#ffffff' },
      },
      DEACTIVATED: {
        label: t('Deaktiviert', 'Deactivated'),
        style: { backgroundColor: '#928781', color: '#ffffff' },
      },
      REJECTED: {
        label: t('Abgelehnt', 'Rejected'),
        style: { backgroundColor: '#6B5242', color: '#ffffff' },
      },
      INVITED: {
        label: t('Eingeladen', 'Invited'),
        style: { backgroundColor: '#295A97', color: '#ffffff' },
      },
    }
    return map[status] ?? {
      label: status,
      style: { backgroundColor: '#d0d3cc', color: '#1a1a1a' },
    }
  }

  const statusInfo = getStatusInfo(application.status)

  async function handleToggle(
    service: ToggleableService,
    value: boolean
  ) {
    setServices((s) => ({ ...s, [service]: value }))
    await toggleService(id, service, value)
  }

  async function handleDeactivate() {
    setCardActive(false)
    setServices({
      wlanAccess: false,
      libraryAccess: false,
    })
    await deactivateCard(id)
  }

  async function handleReactivate() {
    setCardActive(true)
    setServices({
      wlanAccess: true,
      libraryAccess: true,
    })
    await reactivateCard(id)
  }

  async function handleReject() {
    if (window.confirm(t(
      'Sind Sie sicher, dass Sie diesen Antrag ablehnen und entfernen mochten?',
      'Are you sure you want to reject and remove this application?'
    ))) {
      await rejectApplication(id)
    }
  }

  function handleExport() {
    generatePdf(
      {
        guestName: application.guestName,
        guestEmail: application.guestEmail,
        dateOfBirth: application.dateOfBirth,
        hostName: application.hostName,
        homeAddress: application.homeAddress,
        halleAddress: application.halleAddress,
        arrivalDate: application.arrivalDate,
        departureDate: application.departureDate,
        status: application.status,
        wlanAccess: services.wlanAccess,
        libraryAccess: services.libraryAccess,
        referenceNumber: application.guestNumber ?? application.applicationNumber,
        guestSignedAt: application.guestSignedAt ? new Date(application.guestSignedAt).toISOString() : null,
        hostSignedAt: application.hostSignedAt ? new Date(application.hostSignedAt).toISOString() : null,
        hostSignature: application.hostSignature ?? null,
      },
      t,
      lang
    )
  }

  const dtStyle: React.CSSProperties = {
    color: '#5a5a5a',
    fontSize: '0.82em',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  }
  const ddStyle: React.CSSProperties = { color: '#1a1a1a', fontWeight: 500, marginTop: '2px' }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
            {t('Gastgenehmigung', 'Guest Approval')}
          </h1>
          {application.guestNumber && (
            <p className="text-xs mt-1" style={{ color: '#5a5a5a' }}>
              {t('Gastenummer', 'Guest Number')}:{' '}
              <code className="font-mono font-semibold" style={{ color: '#295A97' }}>
                {application.guestNumber}
              </code>
            </p>
          )}
          {application.applicationNumber && !application.guestNumber && (
            <p className="text-xs mt-1" style={{ color: '#5a5a5a' }}>
              {t('Antragsnummer', 'Application Number')}:{' '}
              <code className="font-mono font-semibold" style={{ color: '#295A97' }}>
                {application.applicationNumber}
              </code>
            </p>
          )}
        </div>
        <Badge
          className="px-3 py-1 text-xs font-semibold rounded-full border-0"
          style={statusInfo.style}
        >
          {statusInfo.label}
        </Badge>
      </div>

      {/* Card status banners (hidden for host read-only) */}
      {!hostView && !cardActive && application.status !== 'REJECTED' && (
        <div
          className="mb-4 rounded border p-4 text-sm text-center space-y-3"
          style={{ backgroundColor: '#fff5f5', borderColor: '#e74c3c', color: '#c0392b' }}
        >
          <p className="font-semibold">
            {t(
              'Diese Gastekarte wurde deaktiviert. Alle Dienste sind gesperrt.',
              'This guest card has been deactivated. All services are disabled.'
            )}
          </p>
          <Button
            onClick={handleReactivate}
            className="text-xs font-semibold"
            style={{ backgroundColor: '#9FBF47', color: '#252C27' }}
          >
            {t('Karte reaktivieren', 'Reactivate Card')}
          </Button>
        </div>
      )}

      {application.status === 'REJECTED' && (
        <div
          className="mb-4 rounded border p-4 text-sm text-center"
          style={{ backgroundColor: '#f5f0eb', borderColor: '#6B5242', color: '#6B5242' }}
        >
          <p className="font-semibold">
            {t(
              'Dieser Antrag wurde abgelehnt. Die Gastekarte kann nicht aktiviert werden.',
              'This application has been rejected. The guest card cannot be activated.'
            )}
          </p>
        </div>
      )}

      {isExpired && (
        <div
          className="mb-4 rounded border p-4 text-sm text-center"
          style={{ backgroundColor: '#fff5f5', borderColor: '#e74c3c', color: '#c0392b' }}
        >
          <p className="font-semibold">
            {t(
              'Dieser Antrag ist abgelaufen. Alle Dienste wurden deaktiviert.',
              'This application has expired. All services have been deactivated.'
            )}
          </p>
        </div>
      )}

      {/* Guest data */}
      <Card className="mb-6" style={{ borderColor: '#d0d3cc' }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base" style={{ color: '#252C27' }}>
            {t('Gastdaten', 'Guest Data')}
          </CardTitle>
          {application.status !== 'APPROVED' && !hostView && (
            <Button
              onClick={handleExport}
              className="text-xs font-semibold"
              style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
            >
              {t('Exportieren', 'Export')}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt style={dtStyle}>Name</dt>
              <dd style={ddStyle}>{application.guestName}</dd>
            </div>
            <div>
              <dt style={dtStyle}>E-Mail</dt>
              <dd style={ddStyle}>{application.guestEmail}</dd>
            </div>
            <div>
              <dt style={dtStyle}>{t('Geburtsdatum', 'Date of Birth')}</dt>
              <dd style={ddStyle}>{application.dateOfBirth.toLocaleDateString(locale)}</dd>
            </div>
            {application.nationality && (
              <div>
                <dt style={dtStyle}>{t('Staatsangehörigkeit', 'Nationality')}</dt>
                <dd style={ddStyle}>{application.nationality}</dd>
              </div>
            )}
            <div>
              <dt style={dtStyle}>{t('Betreuer', 'Host')}</dt>
              <dd style={ddStyle}>{application.hostName}</dd>
            </div>
            {application.hostFaculty && (
              <div>
                <dt style={dtStyle}>{t('Fakultät', 'Faculty')}</dt>
                <dd style={ddStyle}>{application.hostFaculty}</dd>
              </div>
            )}
            {application.hostPhone && (
              <div>
                <dt style={dtStyle}>{t('Telefon', 'Phone')}</dt>
                <dd style={ddStyle}>{application.hostPhone}</dd>
              </div>
            )}
            {application.costCenter && (
              <div>
                <dt style={dtStyle}>{t('Kostenstelle', 'Cost Center')}</dt>
                <dd style={ddStyle}>{application.costCenter}</dd>
              </div>
            )}
            <div className="col-span-2">
              <dt style={dtStyle}>{t('Heimatadresse', 'Home Address')}</dt>
              <dd style={ddStyle}>{application.homeAddress}</dd>
            </div>
            <div className="col-span-2">
              <dt style={dtStyle}>{t('Adresse in Halle', 'Address in Halle')}</dt>
              <dd style={ddStyle}>{application.halleAddress}</dd>
            </div>
            <div>
              <dt style={dtStyle}>{t('Anreise', 'Arrival')}</dt>
              <dd style={ddStyle}>{application.arrivalDate.toLocaleDateString(locale)}</dd>
            </div>
            <div>
              <dt style={dtStyle}>{t('Abreise', 'Departure')}</dt>
              <dd style={ddStyle}>{application.departureDate.toLocaleDateString(locale)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Services card for approved/active cards (hidden for host read-only) */}
      {!hostView && application.status !== 'PENDING_HOST' && application.status !== 'REJECTED' && !isExpired && (
        <Card className="mb-6" style={{ borderColor: '#d0d3cc' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base" style={{ color: '#252C27' }}>
              {t('Dienstleistungen / Services', 'Services')}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleExport}
                className="text-xs font-semibold"
                style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
              >
                {t('Exportieren', 'Export')}
              </Button>
              {cardActive && (
                <Button
                  onClick={handleDeactivate}
                  className="text-xs font-semibold"
                  style={{ backgroundColor: '#e74c3c', color: '#ffffff' }}
                >
                  {t('Karte deaktivieren', 'Deactivate Card')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <ServiceRow
              label={t('WLAN-Zugang (eduroam)', 'WLAN Access (eduroam)')}
              active={services.wlanAccess}
              canToggle
              disabled={!cardActive}
              onToggle={(v) => handleToggle('wlanAccess', v)}
              description={t(
                'Eduroam-WLAN auf dem gesamten Campus',
                'Eduroam WLAN across the campus'
              )}
              extraInfo={!application.wlanProvisioned ? t('(noch nicht von ITZ bereitgestellt)', '(not yet provisioned by ITZ)') : undefined}
            />
            <ServiceRow
              label={t('Bibliothekszugang', 'Library Access')}
              active={services.libraryAccess}
              canToggle
              disabled={!cardActive}
              onToggle={(v) => handleToggle('libraryAccess', v)}
              description={t(
                'Zugang zur ULB und Campusbibliotheken',
                'Access to ULB and campus libraries'
              )}
              extraInfo={!application.libraryProvisioned ? t('(noch nicht von ITZ bereitgestellt)', '(not yet provisioned by ITZ)') : undefined}
            />
            {/* Mensa - always active, show fake balance */}
            <div
              className="flex items-center gap-3 rounded p-3 text-sm"
              style={{ backgroundColor: '#e8f5e9' }}
            >
              <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: '#27ae60' }} />
              <div className="flex-1">
                <span className="font-semibold" style={{ color: '#1a1a1a' }}>
                  {t('Mensa-Zahlungen (NFC)', 'Mensa Payments (NFC)')}
                </span>
                <p className="text-xs mt-0.5" style={{ color: '#5a5a5a' }}>
                  {t('Automatisch aktiviert. Guthaben:', 'Automatically enabled. Balance:')}{' '}
                  <span className="font-semibold" style={{ color: '#252C27' }}>€42,00</span>
                </p>
              </div>
            </div>
            <ServiceRow
              label={t('Externer VPN-Zugang', 'External VPN Access')}
              active={false}
              description={t(
                'Rechtlich ausgeschlossen fur Gaste',
                'Legally excluded for guests'
              )}
            />
          </CardContent>
        </Card>
      )}

      {/* Pending host: approve or reject (only for host view) */}
      {hostView && application.status === 'PENDING_HOST' && (
        <Card className="mb-6" style={{ borderColor: '#d0d3cc' }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base" style={{ color: '#252C27' }}>
              {t('Antrag', 'Application')}
            </CardTitle>
            <Button
              onClick={handleExport}
              className="text-xs font-semibold"
              style={{ backgroundColor: '#295A97', color: '#FFFFFF' }}
            >
              {t('Exportieren', 'Export')}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-3 text-sm font-semibold" style={{ color: '#1a1a1a' }}>
                {t('Haftungsubernahme', 'Assumption of Liability')}
              </p>
              <p className="mb-3 text-sm" style={{ color: '#1a1a1a' }}>
                {t(
                  'Durch die Genehmigung dieses Antrags bestatige ich, dass ich der verantwortliche Betreuer fur den oben genannten Gast bin und hiermit rechtlich die finanzielle Haftung fur alle Verpflichtungen ubernehme, die wahrend seines Aufenthalts entstehen.',
                  'By approving this application, I confirm that I am the responsible host for the above guest and hereby legally assume financial liability for any obligations incurred during their stay.'
                )}
              </p>
              <ApprovalForm id={id} />
            </div>
            <div className="border-t pt-4" style={{ borderColor: '#d0d3cc' }}>
              <p className="mb-3 text-sm" style={{ color: '#5a5a5a' }}>
                {t(
                  'Alternativ konnen Sie diesen Antrag ablehnen.',
                  'Alternatively, you can reject this application.'
                )}
              </p>
              <Button
                onClick={handleReject}
                className="text-xs font-semibold"
                style={{ backgroundColor: '#e74c3c', color: '#ffffff' }}
              >
                {t('Antrag ablehnen und entfernen', 'Reject & Remove Application')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
