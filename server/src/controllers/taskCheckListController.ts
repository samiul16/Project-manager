import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash } from "crypto";

const prisma = new PrismaClient();

export const createTaskChecklist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;
    const task = await prisma.taskChecklist.create({
      data: {
        title,
        orgId: req.user.orgId,
        task: {
          connect: { id: taskId },
        },
        completed: false,
        createdAt: new Date(),
        createdBy: req.user.id,
      },
    });
    console.log("checking for created task check List ", task);
    res.status(201).json(task);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a task checklist: ${error.message}` });
  }
};

interface TaskChecklistUpdateInput {
  title?: string;
  completed?: boolean;
}

export const updateTaskChecklist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { checklistId } = req.params;
    const { body } = req.body;

    const task = await prisma.taskChecklist.findUnique({
      where: {
        id: checklistId,
        orgId: req.user.orgId,
      },
    });

    if (!task) throw new Error("Task not found");

    const updateData: TaskChecklistUpdateInput = {};

    if (body.title && body.title !== task.title) updateData.title = body.title;
    if (body.hasOwnProperty("completed") && body.completed !== task.completed)
      updateData.completed = body.completed;

    if (updateData) {
      const updatedTask = await prisma.taskChecklist.update({
        where: {
          id: checklistId,
        },
        data: updateData,
      });
      console.log("checking for updated task check List ", updatedTask);
      res.status(200).json(updatedTask);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error updating a task checklist: ${error.message}` });
  }
};

export const getTaskCheckLists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const tasks = await prisma.taskChecklist.findMany({
      where: {
        taskId: taskId,
        orgId: req.user.orgId,
      },
    });
    console.log("checking for task check List ", tasks);
    res.status(200).json(tasks);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error getting task checklists: ${error.message}` });
  }
};
