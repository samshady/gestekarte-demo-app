import prisma from '@/lib/prisma'
import { AdminDashboard } from './AdminDashboard'

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const applications = await prisma.guestApplication.findMany({
    where: { status: 'APPROVED' },
    orderBy: { arrivalDate: 'asc' },
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
          Admin Panel
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#928781' }}>
          WLAN-Zugänge und Bibliothekskonten für genehmigte Gäste bereitstellen
        </p>
      </div>

      <AdminDashboard applications={JSON.parse(JSON.stringify(applications))} />
    </div>
  )
}
