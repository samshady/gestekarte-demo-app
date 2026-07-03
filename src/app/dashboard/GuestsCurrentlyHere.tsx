'use client'

import { useLanguage } from '@/lib/language'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, MapPin } from 'lucide-react'

interface Guest {
  id: string
  guestName: string
  hostName: string
  arrivalDate: string
  departureDate: string
  halleAddress: string
  wlanAccess: boolean
  libraryAccess: boolean
  mensaPayments: boolean
  guestNumber: string | null
}

export function GuestsCurrentlyHere({
  guests,
  upcoming,
}: {
  guests: Guest[]
  upcoming: Guest[]
}) {
  const { t, lang } = useLanguage()
  const locale = lang === 'de' ? 'de-DE' : 'en-GB'

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Currently here */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" style={{ color: '#9FBF47' }} />
            <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
              {t('Derzeit in Halle', 'Currently in Halle')}
            </CardTitle>
            <Badge className="ml-auto rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: '#f4f8ed', color: '#9FBF47' }}>
              {guests.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {guests.length === 0 ? (
            <p className="px-4 pb-4 text-sm" style={{ color: '#5a5a5a' }}>
              {t('Derzeit sind keine Gäste vor Ort.', 'No guests currently in Halle.')}
            </p>
          ) : (
            <div className="divide-y" style={{ borderColor: '#E8EAE5' }}>
              {guests.map((g) => {
                const servicesOn = [g.wlanAccess && 'WLAN', g.libraryAccess && t('Bibliothek', 'Library'), g.mensaPayments && t('Mensa', 'Mensa')].filter(Boolean)
                return (
                  <div key={g.id} className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold" style={{ color: '#1a1a1a' }}>{g.guestName}</p>
                      <span className="text-xs font-mono" style={{ color: '#928781' }}>{g.guestNumber ?? '---'}</span>
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: '#5a5a5a' }}>
                      {t('Betreuer', 'Host')}: {g.hostName}
                    </p>
                    <p className="text-xs" style={{ color: '#928781' }}>
                      {new Date(g.arrivalDate).toLocaleDateString(locale)} &ndash; {new Date(g.departureDate).toLocaleDateString(locale)}
                    </p>
                    {servicesOn.length > 0 && (
                      <p className="mt-1 text-xs" style={{ color: '#5a5a5a' }}>
                        {servicesOn.join(' · ')}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" style={{ color: '#295A97' }} />
            <CardTitle className="text-sm font-semibold" style={{ color: '#252C27' }}>
              {t('Anstehende Ankünfte', 'Upcoming Arrivals')}
            </CardTitle>
            <Badge className="ml-auto rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: '#eef3fa', color: '#295A97' }}>
              {upcoming.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {upcoming.length === 0 ? (
            <p className="px-4 pb-4 text-sm" style={{ color: '#5a5a5a' }}>
              {t('Keine anstehenden Ankünfte.', 'No upcoming arrivals.')}
            </p>
          ) : (
            <div className="divide-y" style={{ borderColor: '#E8EAE5' }}>
              {upcoming.map((g) => (
                <div key={g.id} className="px-4 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold" style={{ color: '#1a1a1a' }}>{g.guestName || t('(Name ausstehend)', '(Name pending)')}</p>
                    <span className="text-xs" style={{ color: '#295A97' }}>
                      {t('Anreise', 'Arrival')}: {new Date(g.arrivalDate).toLocaleDateString(locale)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs" style={{ color: '#5a5a5a' }}>
                    {t('Betreuer', 'Host')}: {g.hostName}
                  </p>
                  <p className="text-xs" style={{ color: '#928781' }}>
                    {new Date(g.departureDate).toLocaleDateString(locale)} &middot; {g.halleAddress || '-'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
