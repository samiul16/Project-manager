/*
  Warnings:

  - You are about to drop the column `assignedUserId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_assignedUserId_fkey";

-- DropIndex
DROP INDEX "Task_assignedUserId_idx";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assignedUserId";

-- CreateIndex
CREATE INDEX "TaskAssignment_orgUserId_idx" ON "TaskAssignment"("orgUserId");
