'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { useLanguage } from '@/lib/language'

type SortKey = 'guestName' | 'arrivalDate' | 'departureDate' | 'status'
type SortDir = 'asc' | 'desc'

const trafficLight: Record<string, { labelKey: string; bg: string; text: string }> = {
  PENDING_HOST: { labelKey: 'Ausstehend/Pending', bg: '#f5a623', text: '#1a1a1a' },
  APPROVED: { labelKey: 'Genehmigt/Approved', bg: '#27ae60', text: '#ffffff' },
  EXPIRED: { labelKey: 'Abgelaufen/Expired', bg: '#e74c3c', text: '#ffffff' },
  DEACTIVATED: { labelKey: 'Deaktiviert/Deactivated', bg: '#928781', text: '#ffffff' },
  REJECTED: { labelKey: 'Abgelehnt/Rejected', bg: '#6B5242', text: '#ffffff' },
  INVITED: { labelKey: 'Eingeladen/Invited', bg: '#295A97', text: '#ffffff' },
}

function fmtDate(d: string | Date, locale: string) {
  return new Date(d).toLocaleDateString(locale)
}

export function ApplicationsTable({
  applications,
  hostView = false,
}: {
  applications: {
    id: string
    guestName: string
    guestEmail: string
    hostName: string
    arrivalDate: string | Date
    departureDate: string | Date
    status: string
    referenceNumber: string | null
    guestNumber: string | null
    applicationNumber: string | null
  }[]
  hostView?: boolean
}) {
  const { t, lang } = useLanguage()
  const [sortKey, setSortKey] = useState<SortKey>('arrivalDate')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const locale = lang === 'de' ? 'de-DE' : 'en-GB'

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    return [...applications].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'guestName':
          cmp = a.guestName.localeCompare(b.guestName)
          break
        case 'arrivalDate':
          cmp = new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime()
          break
        case 'departureDate':
          cmp = new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
          break
        case 'status':
          cmp = a.status.localeCompare(b.status)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [applications, sortKey, sortDir])

  function SortIcon({ col }: { col: SortKey }) {
    if (col !== sortKey) return <ArrowUpDown className="inline h-3 w-3 ml-1 opacity-40" />
    return sortDir === 'asc'
      ? <ArrowUp className="inline h-3 w-3 ml-1" />
      : <ArrowDown className="inline h-3 w-3 ml-1" />
  }

  const thStyle: React.CSSProperties = {
    color: '#928781',
    fontWeight: 600,
    fontSize: '0.78em',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  return (
    <div className="overflow-hidden rounded-xl border-0 shadow-sm">
      <div className="border-b px-4 py-3" style={{ borderColor: '#E8EAE5', backgroundColor: '#FFFFFF' }}>
        <h2 className="text-sm font-semibold" style={{ color: '#252C27' }}>
          {hostView ? t('Meine Gäste', 'My Guests') : t('Alle Anträge', 'All Applications')}
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow style={{ borderColor: '#E8EAE5' }}>
            <TableHead style={thStyle} onClick={() => toggleSort('guestName')}>
              {t('Name', 'Name')} <SortIcon col="guestName" />
            </TableHead>
            <TableHead style={thStyle}>
              {t('Nummer', 'No.')}
            </TableHead>
            {!hostView && (
              <TableHead style={thStyle} onClick={() => toggleSort('status')}>
                {t('Betreuer', 'Host')} <SortIcon col="status" />
              </TableHead>
            )}
            <TableHead style={thStyle} onClick={() => toggleSort('arrivalDate')}>
              {t('Anreise', 'Arrival')} <SortIcon col="arrivalDate" />
            </TableHead>
            <TableHead style={thStyle} onClick={() => toggleSort('departureDate')}>
              {t('Abreise', 'Departure')} <SortIcon col="departureDate" />
            </TableHead>
            <TableHead style={thStyle} onClick={() => toggleSort('status')}>
              {t('Status', 'Status')} <SortIcon col="status" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((app) => {
            const tl = trafficLight[app.status] ?? { labelKey: app.status, bg: '#d0d3cc', text: '#1a1a1a' }
            return (
              <TableRow key={app.id} style={{ borderColor: '#E8EAE5' }}>
                <TableCell className="font-medium">
                  <Link
                    href={hostView ? `/host-approval/${app.id}?hostView=true` : `/host-approval/${app.id}`}
                    className="underline underline-offset-2"
                    style={{ color: app.guestName ? '#295A97' : '#928781' }}
                  >
                    {app.guestName || app.guestEmail || `(${app.applicationNumber ?? app.id.slice(0, 8)})`}
                  </Link>
                </TableCell>
                <TableCell style={{ color: '#5a5a5a', fontFamily: 'monospace', fontSize: '0.82em' }}>
                  {app.guestNumber ?? app.applicationNumber ?? '---'}
                </TableCell>
                {!hostView && (
                  <TableCell style={{ color: '#1a1a1a' }}>{app.hostName}</TableCell>
                )}
                <TableCell style={{ color: '#1a1a1a' }}>
                  {fmtDate(app.arrivalDate, locale)}
                </TableCell>
                <TableCell style={{ color: '#1a1a1a' }}>
                  {fmtDate(app.departureDate, locale)}
                </TableCell>
                <TableCell>
                  <Badge
                    className="px-3 py-1 text-xs font-semibold rounded-full border-0"
                    style={{ backgroundColor: tl.bg, color: tl.text }}
                  >
                    {t(
                      app.status === 'PENDING_HOST' ? 'Ausstehend' : app.status === 'APPROVED' ? 'Genehmigt' : app.status === 'DEACTIVATED' ? 'Deaktiviert' : app.status === 'REJECTED' ? 'Abgelehnt' : app.status === 'INVITED' ? 'Eingeladen' : 'Abgelaufen',
                      app.status === 'PENDING_HOST' ? 'Pending' : app.status === 'APPROVED' ? 'Approved' : app.status === 'DEACTIVATED' ? 'Deactivated' : app.status === 'REJECTED' ? 'Rejected' : app.status === 'INVITED' ? 'Invited' : 'Expired'
                    )}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
