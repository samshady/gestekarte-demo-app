import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const application = await prisma.guestApplication.findUnique({ where: { id } })
  if (!application) {
    return NextResponse.json(null, { status: 404 })
  }
  return NextResponse.json(application)
}
