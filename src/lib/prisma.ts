import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@/generated/prisma/client'
import path from 'path'

declare global {
  var prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? 'file:./dev.db'
  if (!raw.startsWith('file:')) return raw
  const filePath = raw.replace(/^file:\/?\/?/, '')
  const absolute = path.resolve(process.cwd(), filePath)
  return `file://${absolute}`
}

const adapter = new PrismaLibSql({
  url: getDatabaseUrl(),
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const prisma = global.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
