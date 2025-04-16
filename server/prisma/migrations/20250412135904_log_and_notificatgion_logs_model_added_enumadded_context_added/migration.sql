-- CreateEnum
CREATE TYPE "LogTypeEnum" AS ENUM ('createLog', 'changeLog', 'deleteLog');

-- CreateEnum
CREATE TYPE "LogContextEnum" AS ENUM ('task', 'project', 'organization', 'user');

-- CreateEnum
CREATE TYPE "NotificationLogTypeEnum" AS ENUM ('sms', 'email', 'message_channel');

-- CreateEnum
CREATE TYPE "NotificationLogContextEnum" AS ENUM ('task', 'project', 'organization', 'user');

-- CreateEnum
CREATE TYPE "NotificationLogChannelEnum" AS ENUM ('whatsApp');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "whatsAppNumber" TEXT;

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "type" "LogTypeEnum" NOT NULL,
    "orgId" TEXT NOT NULL,
    "oldData" TEXT,
    "newData" TEXT,
    "oldId" TEXT,
    "newId" TEXT,
    "taskId" TEXT,
    "context" "LogContextEnum" NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "type" "NotificationLogTypeEnum" NOT NULL,
    "context" "NotificationLogContextEnum" NOT NULL,
    "orgId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "taskId" TEXT,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "toEmail" TEXT,
    "toPhone" TEXT,
    "channel" "NotificationLogChannelEnum",

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Log_type_idx" ON "Log"("type");

-- CreateIndex
CREATE INDEX "Log_context_idx" ON "Log"("context");

-- CreateIndex
CREATE INDEX "Log_projectId_idx" ON "Log"("projectId");

-- CreateIndex
CREATE INDEX "Log_oldId_idx" ON "Log"("oldId");

-- CreateIndex
CREATE INDEX "Log_newId_idx" ON "Log"("newId");

-- CreateIndex
CREATE INDEX "Log_taskId_idx" ON "Log"("taskId");

-- CreateIndex
CREATE INDEX "NotificationLog_type_idx" ON "NotificationLog"("type");

-- CreateIndex
CREATE INDEX "NotificationLog_context_idx" ON "NotificationLog"("context");

-- CreateIndex
CREATE INDEX "NotificationLog_projectId_idx" ON "NotificationLog"("projectId");

-- CreateIndex
CREATE INDEX "NotificationLog_receiverId_idx" ON "NotificationLog"("receiverId");

-- CreateIndex
CREATE INDEX "NotificationLog_taskId_idx" ON "NotificationLog"("taskId");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "OrganizationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
