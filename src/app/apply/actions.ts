'use server'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function submitApplication(formData: FormData) {
  const guestSalutation = formData.get('guestSalutation') as string
  const nationality = formData.get('nationality') as string
  const guestName = formData.get('guestName') as string
  const guestEmail = formData.get('guestEmail') as string
  const dateOfBirth = formData.get('dateOfBirth') as string
  const homeAddress = formData.get('homeAddress') as string
  const halleAddress = formData.get('halleAddress') as string
  const arrivalDate = formData.get('arrivalDate') as string
  const departureDate = formData.get('departureDate') as string
  const hostName = formData.get('hostName') as string
  const wlanAccess = formData.get('wlanAccess') === 'on'
  const libraryAccess = formData.get('libraryAccess') === 'on'

  const count = await prisma.guestApplication.count()
  const applicationNumber = `A-${String(count + 1).padStart(4, '0')}`

  const application = await prisma.guestApplication.create({
    data: {
      guestName,
      guestSalutation: guestSalutation || null,
      nationality: nationality || null,
      guestEmail,
      dateOfBirth: new Date(dateOfBirth),
      homeAddress,
      halleAddress,
      arrivalDate: new Date(arrivalDate),
      departureDate: new Date(departureDate),
      photoUrl: '/uploads/mock-photo.jpg',
      hostName,
      status: 'PENDING_HOST',
      wlanAccess,
      libraryAccess,
      applicationNumber,
    },
  })

  redirect(`/apply/success?id=${application.id}&appNum=${applicationNumber}`)
}
