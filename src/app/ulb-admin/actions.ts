'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function ulbProvisionLibrary(id: string) {
  await prisma.guestApplication.update({
    where: { id },
    data: { libraryProvisioned: true, provisionedAt: new Date() },
  })
  revalidatePath('/ulb-admin')
  revalidatePath(`/host-approval/${id}`)
}

export async function ulbRevokeLibrary(id: string) {
  await prisma.guestApplication.update({
    where: { id },
    data: { libraryProvisioned: false },
  })
  revalidatePath('/ulb-admin')
  revalidatePath(`/host-approval/${id}`)
}
