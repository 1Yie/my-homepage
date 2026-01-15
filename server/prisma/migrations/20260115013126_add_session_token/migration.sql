/*
  Warnings:

  - You are about to drop the column `sessionToken` on the `session` table. All the data in the column will be lost.
  - The required column `token` was added to the `session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session" ("createdAt", "expiresAt", "id", "ipAddress", "updatedAt", "userAgent", "userId") SELECT "createdAt", "expiresAt", "id", "ipAddress", "updatedAt", "userAgent", "userId" FROM "session";
DROP TABLE "session";
ALTER TABLE "new_session" RENAME TO "session";
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
