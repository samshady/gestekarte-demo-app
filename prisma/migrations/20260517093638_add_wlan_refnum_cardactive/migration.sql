-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuestApplication" (
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
    "wlanAccess" BOOLEAN NOT NULL DEFAULT true,
    "libraryAccess" BOOLEAN NOT NULL DEFAULT true,
    "mensaPayments" BOOLEAN NOT NULL DEFAULT true,
    "vpnAccess" BOOLEAN NOT NULL DEFAULT false,
    "databaseAccess" BOOLEAN NOT NULL DEFAULT false,
    "cardActive" BOOLEAN NOT NULL DEFAULT true,
    "referenceNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_GuestApplication" ("arrivalDate", "createdAt", "databaseAccess", "dateOfBirth", "departureDate", "guestEmail", "guestName", "halleAddress", "homeAddress", "hostName", "id", "libraryAccess", "mensaPayments", "photoUrl", "status", "updatedAt", "vpnAccess") SELECT "arrivalDate", "createdAt", "databaseAccess", "dateOfBirth", "departureDate", "guestEmail", "guestName", "halleAddress", "homeAddress", "hostName", "id", "libraryAccess", "mensaPayments", "photoUrl", "status", "updatedAt", "vpnAccess" FROM "GuestApplication";
DROP TABLE "GuestApplication";
ALTER TABLE "new_GuestApplication" RENAME TO "GuestApplication";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
