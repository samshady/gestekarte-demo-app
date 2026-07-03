import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ref = searchParams.get('ref')

  if (!ref) {
    return NextResponse.json({ error: 'Missing ref parameter' }, { status: 400 })
  }

  const application = await prisma.guestApplication.findFirst({
    where: {
      OR: [
        { applicationNumber: ref },
        { guestNumber: ref },
      ],
    },
  })

  if (!application) {
    return NextResponse.json(null, { status: 404 })
  }

  return NextResponse.json(application)
}
