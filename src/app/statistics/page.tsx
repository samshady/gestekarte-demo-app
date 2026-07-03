import prisma from '@/lib/prisma'
import { StatsCards } from './StatsCards'
import { StatusChart } from './StatusChart'
import { MonthlyChart } from './MonthlyChart'
import { ApplicationTimeline } from './ApplicationTimeline'

export default async function StatisticsPage() {
  const [total, pending, active, deactivated, expired, rejected, invited, applications] = await Promise.all([
    prisma.guestApplication.count(),
    prisma.guestApplication.count({ where: { status: 'PENDING_HOST' } }),
    prisma.guestApplication.count({ where: { status: 'APPROVED' } }),
    prisma.guestApplication.count({ where: { status: 'DEACTIVATED' } }),
    prisma.guestApplication.count({ where: { status: 'EXPIRED' } }),
    prisma.guestApplication.count({ where: { status: 'REJECTED' } }),
    prisma.guestApplication.count({ where: { status: 'INVITED' } }),
    prisma.guestApplication.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        guestName: true,
        status: true,
        createdAt: true,
        guestNumber: true,
        applicationNumber: true,
      },
    }),
  ])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
          Statistiken
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#928781' }}>
          Übersicht über alle Gastekartenanträge und deren Status
        </p>
      </div>

      <div className="mb-8">
        <StatsCards total={total} pending={pending} active={active} deactivated={deactivated} expired={expired} rejected={rejected} invited={invited} />
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <StatusChart
          pending={pending}
          active={active}
          deactivated={deactivated}
          expired={expired}
          rejected={rejected}
          invited={invited}
        />
        <MonthlyChart applications={applications} />
      </div>

      <div>
        <ApplicationTimeline applications={applications} />
      </div>
    </div>
  )
}
