/*
  Warnings:

  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organizationId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserRole";

-- CreateTable
CREATE TABLE "OrgUserRole" (
    "id" TEXT NOT NULL,
    "orgUserId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "OrgUserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrgUserRole_orgUserId_roleId_key" ON "OrgUserRole"("orgUserId", "roleId");

-- AddForeignKey
ALTER TABLE "OrgUserRole" ADD CONSTRAINT "OrgUserRole_orgUserId_fkey" FOREIGN KEY ("orgUserId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUserRole" ADD CONSTRAINT "OrgUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
