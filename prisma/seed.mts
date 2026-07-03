import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '../src/generated/prisma/client'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? 'file:./dev.db'
  if (raw.startsWith('file://')) return raw
  const filePath = raw.replace(/^file:/, '')
  const absolute = path.resolve(path.join(__dirname, '..'), filePath)
  return `file://${absolute}`
}

const adapter = new PrismaLibSql({
  url: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

const applications = [
  {
    guestName: 'Dr. Elena Rostova',
    guestEmail: 'elena.rostova@icea.uni-halle.de',
    dateOfBirth: new Date('1985-03-12'),
    homeAddress: 'ul. Tverskaya 15, Moskau, Russland',
    halleAddress: 'Adam-Kuckhoff-Strasse 17, 06108 Halle (Saale)',
    arrivalDate: new Date('2026-06-01'),
    departureDate: new Date('2026-08-30'),
    photoUrl: '/uploads/mock-photo-1.jpg',
    hostName: 'Prof. Dr. Thomas Weber',
    status: 'APPROVED',
    wlanAccess: true,
    libraryAccess: true,
    mensaPayments: true,
    vpnAccess: false,
    databaseAccess: true,
    cardActive: true,
    referenceNumber: 'G-2026-0001',
  },
  {
    guestName: 'Dr. Markus Lehmann',
    guestEmail: 'markus.lehmann@uni-halle.de',
    dateOfBirth: new Date('1978-11-05'),
    homeAddress: 'Musterstrasse 42, 12345 Berlin',
    halleAddress: 'Universitatsplatz 10, 06108 Halle (Saale)',
    arrivalDate: new Date('2026-07-15'),
    departureDate: new Date('2026-09-15'),
    photoUrl: '/uploads/mock-photo-2.jpg',
    hostName: 'Prof. Dr. Thomas Weber',
    status: 'PENDING_HOST',
    wlanAccess: true,
    libraryAccess: true,
    mensaPayments: true,
    vpnAccess: false,
    databaseAccess: false,
    cardActive: true,
    referenceNumber: null,
  },
  {
    guestName: 'Prof. Anna Kowalski',
    guestEmail: 'anna.kowalski@uw.edu.pl',
    dateOfBirth: new Date('1972-06-20'),
    homeAddress: 'ul. Nowy Swiat 5, Warschau, Polen',
    halleAddress: 'Heinrich-und-Thomas-Mann-Strasse 22, 06108 Halle (Saale)',
    arrivalDate: new Date('2026-08-01'),
    departureDate: new Date('2026-10-31'),
    photoUrl: '/uploads/mock-photo-3.jpg',
    hostName: 'Prof. Dr. Sabine Muller',
    status: 'APPROVED',
    wlanAccess: true,
    libraryAccess: true,
    mensaPayments: true,
    vpnAccess: false,
    databaseAccess: true,
    cardActive: true,
    referenceNumber: 'G-2026-0002',
  },
  {
    guestName: 'Dr. James Chen',
    guestEmail: 'james.chen@oxford.ac.uk',
    dateOfBirth: new Date('1989-09-14'),
    homeAddress: '10 Broad Street, Oxford, UK',
    halleAddress: 'Emil-Abderhalden-Strasse 25, 06108 Halle (Saale)',
    arrivalDate: new Date('2026-05-01'),
    departureDate: new Date('2026-05-15'),
    photoUrl: '/uploads/mock-photo-4.jpg',
    hostName: 'Dr. Anna Fischer',
    status: 'EXPIRED',
    wlanAccess: true,
    libraryAccess: true,
    mensaPayments: true,
    vpnAccess: false,
    databaseAccess: false,
    cardActive: true,
    referenceNumber: 'G-2025-0003',
  },
  {
    guestName: 'Dr. Sara Beltran',
    guestEmail: 'sara.beltran@ub.edu',
    dateOfBirth: new Date('1991-01-30'),
    homeAddress: 'Carrer de la Universitat 12, Barcelona, Spanien',
    halleAddress: 'Ludwig-Wucherer-Strasse 8, 06108 Halle (Saale)',
    arrivalDate: new Date('2026-09-01'),
    departureDate: new Date('2026-12-20'),
    photoUrl: '/uploads/mock-photo-5.jpg',
    hostName: 'Prof. Dr. Thomas Weber',
    status: 'PENDING_HOST',
    wlanAccess: true,
    libraryAccess: true,
    mensaPayments: true,
    vpnAccess: false,
    databaseAccess: false,
    cardActive: true,
    referenceNumber: null,
  },
  {
    guestName: 'Dr. Yuki Tanaka',
    guestEmail: 'yuki.tanaka@tokyo.ac.jp',
    dateOfBirth: new Date('1987-07-22'),
    homeAddress: '7-3-1 Hongo, Bunkyo, Tokio, Japan',
    halleAddress: 'Grosse Steinstrasse 73, 06108 Halle (Saale)',
    arrivalDate: new Date('2026-10-01'),
    departureDate: new Date('2027-03-31'),
    photoUrl: '/uploads/mock-photo-6.jpg',
    hostName: 'Dr. Anna Fischer',
    status: 'PENDING_HOST',
    wlanAccess: true,
    libraryAccess: true,
    mensaPayments: true,
    vpnAccess: false,
    databaseAccess: true,
    cardActive: true,
    referenceNumber: null,
  },
  {
    guestName: 'Dr. Maria Schmidt',
    guestEmail: 'maria.schmidt@uni-halle.de',
    dateOfBirth: new Date('1980-04-15'),
    homeAddress: 'Bahnhofstrasse 20, 04107 Leipzig',
    halleAddress: 'Hansering 15, 06108 Halle (Saale)',
    arrivalDate: new Date('2026-02-01'),
    departureDate: new Date('2026-05-31'),
    photoUrl: '/uploads/mock-photo-7.jpg',
    hostName: 'Prof. Dr. Klaus Richter',
    status: 'DEACTIVATED',
    wlanAccess: false,
    libraryAccess: false,
    mensaPayments: false,
    vpnAccess: false,
    databaseAccess: false,
    cardActive: false,
    referenceNumber: 'G-2026-0004',
  },
]

async function main() {
  console.log('Seeding database...')
  for (const app of applications) {
    await prisma.guestApplication.create({ data: app })
  }
  console.log(`Seeded ${applications.length} guest applications.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
