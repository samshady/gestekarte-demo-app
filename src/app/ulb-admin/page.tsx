import prisma from '@/lib/prisma'
import { UlbDashboard } from './UlbDashboard'

export const dynamic = 'force-dynamic';

export default async function UlbAdminPage() {
  const applications = await prisma.guestApplication.findMany({
    where: { status: 'APPROVED' },
    orderBy: { arrivalDate: 'asc' },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
          ULB - Bibliotheksverwaltung
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#928781' }}>
          Bibliothekszugänge für genehmigte Gäste verwalten
        </p>
      </div>

      <UlbDashboard applications={JSON.parse(JSON.stringify(applications))} />
    </div>
  )
}
