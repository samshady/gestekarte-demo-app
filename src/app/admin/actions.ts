'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function provisionWlan(id: string) {
  await prisma.guestApplication.update({
    where: { id },
    data: { wlanProvisioned: true, provisionedAt: new Date() },
  })
  revalidatePath('/admin')
  revalidatePath(`/host-approval/${id}`)
}

export async function provisionLibrary(id: string) {
  await prisma.guestApplication.update({
    where: { id },
    data: { libraryProvisioned: true, provisionedAt: new Date() },
  })
  revalidatePath('/admin')
  revalidatePath(`/host-approval/${id}`)
}

export async function provisionAll(id: string) {
  const app = await prisma.guestApplication.findUnique({ where: { id } })
  if (!app) return

  const data: Record<string, boolean | Date> = {
    wlanProvisioned: !!app.wlanAccess,
    libraryProvisioned: !!app.libraryAccess,
  }
  if (app.wlanAccess || app.libraryAccess) {
    data.provisionedAt = new Date()
  }

  await prisma.guestApplication.update({ where: { id }, data })
  revalidatePath('/admin')
  revalidatePath(`/host-approval/${id}`)
}

export async function revokeWlan(id: string) {
  await prisma.guestApplication.update({
    where: { id },
    data: { wlanProvisioned: false },
  })
  revalidatePath('/admin')
  revalidatePath(`/host-approval/${id}`)
}

export async function revokeLibrary(id: string) {
  await prisma.guestApplication.update({
    where: { id },
    data: { libraryProvisioned: false },
  })
  revalidatePath('/admin')
  revalidatePath(`/host-approval/${id}`)
}
