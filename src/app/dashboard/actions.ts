'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function extendApplicationExpiry(
  number: string,
  newDepartureDate: string
) {
  const application = await prisma.guestApplication.findFirst({
    where: {
      OR: [
        { applicationNumber: number },
        { guestNumber: number },
      ],
    },
  })

  if (!application) {
    throw new Error('Application not found')
  }

  await prisma.guestApplication.update({
    where: { id: application.id },
    data: { departureDate: new Date(newDepartureDate) },
  })
  revalidatePath('/dashboard')
  revalidatePath(`/host-approval/${application.id}`)
}
