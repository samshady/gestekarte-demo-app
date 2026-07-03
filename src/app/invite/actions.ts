'use server'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function inviteGuest(formData: FormData) {
  const guestEmail = formData.get('guestEmail') as string
  const hostSalutation = formData.get('hostSalutation') as string
  const hostName = formData.get('hostName') as string
  const hostEmail = formData.get('hostEmail') as string
  const hostFaculty = formData.get('hostFaculty') as string
  const hostPhone = formData.get('hostPhone') as string
  const costCenter = formData.get('costCenter') as string
  const arrivalDate = formData.get('arrivalDate') as string
  const departureDate = formData.get('departureDate') as string
  const invitedBy = formData.get('invitedBy') as string || hostName

  const count = await prisma.guestApplication.count()
  const applicationNumber = `A-${String(count + 1).padStart(4, '0')}`

  const application = await prisma.guestApplication.create({
    data: {
      guestName: '',
      guestEmail,
      dateOfBirth: new Date(),
      homeAddress: '',
      halleAddress: '',
      arrivalDate: new Date(arrivalDate),
      departureDate: new Date(departureDate),
      photoUrl: '',
      hostName,
      hostSalutation: hostSalutation || null,
      hostEmail: hostEmail || null,
      hostFaculty: hostFaculty || null,
      hostPhone: hostPhone || null,
      costCenter: costCenter || null,
      status: 'INVITED',
      invitedBy,
      applicationNumber,
    },
  })

  redirect(`/invite/success?id=${application.id}&email=${encodeURIComponent(guestEmail)}`)
}
