'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function approveApplication(id: string, hostSignature?: string) {
  const app = await prisma.guestApplication.findUnique({ where: { id } })
  if (!app) return

  let guestNumber = app.guestNumber
  if (!guestNumber) {
    const count = await prisma.guestApplication.count({
      where: { guestNumber: { not: null } },
    })
    guestNumber = `G-${String(count + 1).padStart(4, '0')}`
  }

  await prisma.guestApplication.update({
    where: { id },
    data: {
      status: 'APPROVED',
      guestNumber,
      cardActive: true,
      hostSignedAt: new Date(),
      hostSignature: hostSignature ?? null,
    },
  })
  revalidatePath(`/host-approval/${id}`)
  revalidatePath('/dashboard')
}

export async function toggleService(
  id: string,
  service: 'wlanAccess' | 'libraryAccess' | 'mensaPayments' | 'databaseAccess',
  value: boolean
) {
  await prisma.guestApplication.update({
    where: { id },
    data: { [service]: value },
  })
  revalidatePath(`/host-approval/${id}`)
  revalidatePath('/dashboard')
}

export async function deactivateCard(id: string) {
  await prisma.guestApplication.update({
    where: { id },
    data: {
      cardActive: false,
      status: 'DEACTIVATED',
      wlanAccess: false,
      libraryAccess: false,
      mensaPayments: false,
      databaseAccess: false,
    },
  })
  revalidatePath(`/host-approval/${id}`)
  revalidatePath('/dashboard')
}

export async function reactivateCard(id: string) {
  await prisma.guestApplication.update({
    where: { id },
    data: {
      cardActive: true,
      status: 'APPROVED',
      wlanAccess: true,
      libraryAccess: true,
      mensaPayments: true,
      databaseAccess: true,
    },
  })
  revalidatePath(`/host-approval/${id}`)
  revalidatePath('/dashboard')
}

export async function rejectApplication(id: string) {
  await prisma.guestApplication.update({
    where: { id },
    data: {
      status: 'REJECTED',
    },
  })
  revalidatePath(`/host-approval/${id}`)
  revalidatePath('/dashboard')
}
