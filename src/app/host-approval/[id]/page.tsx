import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ApprovalDetail } from './ApprovalDetail'

export default async function HostApprovalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ hostView?: string }>
}) {
  const { id } = await params
  const { hostView } = await searchParams
  const application = await prisma.guestApplication.findUnique({ where: { id } })

  if (!application) {
    notFound()
  }

  return (
    <ApprovalDetail
      id={id}
      hostView={hostView === 'true'}
      application={{
        guestName: application.guestName,
        guestEmail: application.guestEmail,
        dateOfBirth: application.dateOfBirth,
        hostName: application.hostName,
        hostSalutation: application.hostSalutation,
        hostEmail: application.hostEmail,
        hostFaculty: application.hostFaculty,
        hostPhone: application.hostPhone,
        costCenter: application.costCenter,
        nationality: application.nationality,
        guestSalutation: application.guestSalutation,
        homeAddress: application.homeAddress,
        halleAddress: application.halleAddress,
        arrivalDate: application.arrivalDate,
        departureDate: application.departureDate,
        status: application.status,
        libraryAccess: application.libraryAccess,
        mensaPayments: application.mensaPayments,
        vpnAccess: application.vpnAccess,
        databaseAccess: application.databaseAccess,
        wlanAccess: application.wlanAccess,
        wlanProvisioned: application.wlanProvisioned,
        libraryProvisioned: application.libraryProvisioned,
        cardActive: application.cardActive,
        referenceNumber: application.referenceNumber,
        applicationNumber: application.applicationNumber,
        guestNumber: application.guestNumber,
        guestSignedAt: application.guestSignedAt,
        hostSignedAt: application.hostSignedAt,
        hostSignature: application.hostSignature,
      }}
    />
  )
}
