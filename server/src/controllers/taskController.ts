import {
  createNotificationLog,
  createNotificationLogs,
} from "../services/notificationLog/notificationLogService";
import { sendWhatsApp } from "../services/notification/notificationService";
import {
  NotificationLogChannelEnum,
  NotificationLogContextEnum,
  NotificationLogTypeEnum,
  PrismaClient,
} from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.query.projectId as string;
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        author: {
          include: {
            user: true,
          },
        },
        comments: true,
        attachments: true,
        taskAssignments: {
          include: {
            orgUser: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorUserId,
      assignedUserId,
      attachmentUrl,
      assignedIds,
    } = req.body;

    if (!title || !authorUserId || !projectId || !assignedIds?.length) {
      throw new Error("Missing required fields");
    }

    const result = await prisma.$transaction(async (prisma) => {
      const task = await prisma.task.create({
        data: {
          title,
          description,
          status,
          priority,
          tags,
          startDate,
          dueDate,
          points,
          projectId,
          authorUserId,
          orgId: req.user.orgId,
        },
      });

      if (assignedIds?.length) {
        await prisma.taskAssignment.createMany({
          data: assignedIds.map((id: string) => ({
            orgUserId: id,
            taskId: task.id,
          })),
        });
      }

      if (attachmentUrl) {
        await prisma.attachment.create({
          data: {
            fileURL: attachmentUrl,
            taskId: task.id,
            uploadedById: authorUserId,
          },
        });
      }

      return task;
    });

    const notificationLogContent = `Task ${title} has been assigned to you`;

    const assignedUsers = await prisma.taskAssignment.findMany({
      where: {
        taskId: result.id,
        orgUser: {
          user: {
            NOT: {
              whatsAppNumber: null,
            },
          },
        },
      },
      include: {
        orgUser: {
          include: {
            user: true,
          },
        },
      },
    });

    console.log("checking for assigned users --> ", assignedUsers);

    const notificationLogData = [];

    for (const assignedUser of assignedUsers) {
      console.log("assignedUser --> ", assignedUser);
      if (assignedUser.orgUser.user.whatsAppNumber) {
        const phone =
          assignedUser.orgUser.user.whatsAppNumber[0] === "+"
            ? assignedUser.orgUser.user.whatsAppNumber.replace("+", "")
            : assignedUser.orgUser.user.whatsAppNumber;

        console.log("phone --> ", phone);

        await sendWhatsApp(phone, notificationLogContent);

        console.log("whats app message send --> ", notificationLogData);

        notificationLogData.push({
          type: NotificationLogTypeEnum.message_channel,
          context: NotificationLogContextEnum.task,
          projectId: projectId,
          receiverId: assignedUser.orgUser.id,
          taskId: result.id,
          channel: NotificationLogChannelEnum.whatsApp,
          content: notificationLogContent,
          toEmail: null,
          toPhone: phone,
          orgId: req.user.orgId,
        });
      }
    }

    console.log("notificationLogData --> ", notificationLogData);

    if (notificationLogData.length > 0) {
      await createNotificationLogs(notificationLogData);
    }

    res.status(201).json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task: ${error.message}` });
  }
};

export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
      },
    });
    res.status(200).json(task);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating a task: ${error.message}` });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.query as { id: string };
    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorUserId,
      assignedUserId,
    } = req.body;
    const task = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId,
        authorUserId,
      },
    });
    res.status(200).json(task);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating a task: ${error.message}` });
  }
};

export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const tasks = await prisma.task.findMany({
      where: {
        OR: [{ authorUserId: userId }],
      },
      include: {
        author: true,
        comments: true,
        attachments: true,
        taskAssignments: true,
      },
    });
    res.status(200).json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting user tasks: ${error.message}` });
  }
};

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        orgId: req.user.orgId,
      },
      include: {
        author: true,
        comments: true,
        attachments: true,
        taskAssignments: {
          include: {
            orgUser: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(task);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting task by id: ${error.message}` });
  }
};
