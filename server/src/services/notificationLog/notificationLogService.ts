import {
  NotificationLogChannelEnum,
  NotificationLogContextEnum,
  NotificationLogTypeEnum,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

interface NotificationLogCreateInput {
  type: NotificationLogTypeEnum;
  context: NotificationLogContextEnum;
  projectId: string | null;
  receiverId: string;
  taskId: string | null;
  channel: NotificationLogChannelEnum;
  content: string;
  toEmail: string | null;
  toPhone: string | null;
  orgId: string;
}

export const createNotificationLog = async (
  data: NotificationLogCreateInput
) => {
  return await prisma.notificationLog.create({
    data: {
      type: data.type,
      context: data.context,
      orgId: data.orgId,
      projectId: data.projectId,
      receiverId: data.receiverId,
      taskId: data.taskId,
      channel: data.channel,
      content: data.content,
      toEmail: data.toEmail,
      toPhone: data.toPhone,
    },
  });
};

export const createNotificationLogs = async (
  data: NotificationLogCreateInput[]
) => {
  return await prisma.notificationLog.createMany({
    data,
  });
};
