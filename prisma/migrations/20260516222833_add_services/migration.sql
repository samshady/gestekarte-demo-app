-- CreateTable
CREATE TABLE "GuestApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "homeAddress" TEXT NOT NULL,
    "halleAddress" TEXT NOT NULL,
    "arrivalDate" DATETIME NOT NULL,
    "departureDate" DATETIME NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "hostName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_HOST',
    "libraryAccess" BOOLEAN NOT NULL DEFAULT true,
    "mensaPayments" BOOLEAN NOT NULL DEFAULT true,
    "vpnAccess" BOOLEAN NOT NULL DEFAULT false,
    "databaseAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
