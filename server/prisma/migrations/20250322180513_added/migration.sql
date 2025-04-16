/*
  Warnings:

  - The `status` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('ToDo', 'WorkInProgress', 'UnderReview', 'Completed');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('Urgent', 'High', 'Medium', 'Low', 'Backlog');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" DEFAULT 'ToDo',
DROP COLUMN "priority",
ADD COLUMN     "priority" "TaskPriority" DEFAULT 'Backlog';
