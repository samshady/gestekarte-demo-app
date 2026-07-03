import prisma from '@/lib/prisma'
import { StatsCards } from './StatsCards'
import { ApplicationsTable } from './ApplicationsTable'
import { DashboardHeading } from './DashboardHeading'
import { ExtendCardSection } from './ExtendCardSection'
import { GuestsCurrentlyHere } from './GuestsCurrentlyHere'

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ host?: string }>
}) {
  const { host: hostFilter } = await searchParams
  const hostCondition = hostFilter ? { hostName: hostFilter } : {}

  const now = new Date()
  const [total, pending, active, deactivated, rejected, applications] = await Promise.all([
    prisma.guestApplication.count({ where: hostCondition }),
    prisma.guestApplication.count({ where: { ...hostCondition, status: 'PENDING_HOST' } }),
    prisma.guestApplication.count({ where: { ...hostCondition, status: 'APPROVED' } }),
    prisma.guestApplication.count({ where: { ...hostCondition, status: 'DEACTIVATED' } }),
    prisma.guestApplication.count({ where: { ...hostCondition, status: 'REJECTED' } }),
    prisma.guestApplication.findMany({ where: hostCondition, orderBy: { createdAt: 'desc' } }),
  ])

  const currentGuests = await prisma.guestApplication.findMany({
    where: {
      ...hostCondition,
      status: 'APPROVED',
      arrivalDate: { lte: now },
      departureDate: { gte: now },
    },
    orderBy: { departureDate: 'asc' },
  })

  const upcomingGuests = await prisma.guestApplication.findMany({
    where: {
      ...hostCondition,
      arrivalDate: { gt: now },
      status: { notIn: ['EXPIRED', 'REJECTED'] },
    },
    orderBy: { arrivalDate: 'asc' },
  })

  const isHostView = !!hostFilter

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <DashboardHeading hostFilter={hostFilter} />

      {!isHostView && (
        <div className="mb-8">
          <StatsCards total={total} pending={pending} active={active} deactivated={deactivated} rejected={rejected} />
        </div>
      )}

      {!isHostView && (
        <div className="mb-8">
          <GuestsCurrentlyHere guests={JSON.parse(JSON.stringify(currentGuests))} upcoming={JSON.parse(JSON.stringify(upcomingGuests))} />
        </div>
      )}

      <div className="mb-8">
        <ExtendCardSection />
      </div>

      <ApplicationsTable applications={JSON.parse(JSON.stringify(applications))} hostView={isHostView} />
    </div>
  )
}
