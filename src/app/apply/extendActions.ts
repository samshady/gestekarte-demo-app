'use server'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function lookupApplication(referenceNumber: string) {
  const application = await prisma.guestApplication.findFirst({
    where: { referenceNumber },
  })
  return application
}

export async function extendApplication(formData: FormData) {
  const id = formData.get('id') as string
  const departureDate = formData.get('departureDate') as string

  await prisma.guestApplication.update({
    where: { id },
    data: { departureDate: new Date(departureDate) },
  })

  redirect(`/?extended=true`)
}
