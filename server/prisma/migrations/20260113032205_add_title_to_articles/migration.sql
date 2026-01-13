/*
  Warnings:

  - Added the required column `title` to the `article` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "headerImage" TEXT,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_article" ("authorId", "content", "createdAt", "headerImage", "id", "isDraft", "slug", "title", "updatedAt") SELECT "authorId", "content", "createdAt", "headerImage", "id", "isDraft", "slug", "slug", "updatedAt" FROM "article";
DROP TABLE "article";
ALTER TABLE "new_article" RENAME TO "article";
CREATE UNIQUE INDEX "article_slug_key" ON "article"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
