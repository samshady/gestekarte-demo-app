'use server'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function completeApplication(formData: FormData) {
  const id = formData.get('id') as string
  const guestSalutation = formData.get('guestSalutation') as string
  const nationality = formData.get('nationality') as string
  const guestName = formData.get('guestName') as string
  const guestEmail = formData.get('guestEmail') as string
  const dateOfBirth = formData.get('dateOfBirth') as string
  const homeAddress = formData.get('homeAddress') as string
  const halleAddress = formData.get('halleAddress') as string
  const wlanAccess = formData.get('wlanAccess') === 'on'
  const libraryAccess = formData.get('libraryAccess') === 'on'
  const guestSigned = formData.get('guestSigned') === 'on'

  if (!guestSigned) {
    throw new Error('Guest must sign the application')
  }

  await prisma.guestApplication.update({
    where: { id },
    data: {
      guestName,
      guestSalutation: guestSalutation || null,
      nationality: nationality || null,
      guestEmail,
      dateOfBirth: new Date(dateOfBirth),
      homeAddress,
      halleAddress,
      wlanAccess,
      libraryAccess,
      status: 'PENDING_HOST',
      guestSignedAt: new Date(),
    },
  })

  redirect(`/apply/${id}/success`)
}
