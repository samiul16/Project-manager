import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        orgId: req.user.orgId,
      },
      include: {
        _count: {
          select: {
            tasks: true, // Total number of tasks
          },
        },
        tasks: {
          select: {
            status: true,
          },
        },
        attachments: true,
        projectManagers: {
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

    // Process the projects to calculate totals
    const projectsWithTaskCounts = projects.map((project) => {
      const totalTasks = project._count.tasks;
      const totalInProgressTasks = project.tasks.filter(
        (task) => task.status === "WorkInProgress"
      ).length;
      const totalCompletedTasks = project.tasks.filter(
        (task) => task.status === "Completed"
      ).length;

      return {
        ...project,
        totalNumberOfTasks: totalTasks,
        totalNumberOfInProgressTasks: totalInProgressTasks,
        totalNumberOfCompletedTasks: totalCompletedTasks,
      };
    });
    res.status(200).json(projectsWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: {
        id: id,
        orgId: req.user.orgId,
      },
    });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      imageUrl,
      imageName,
      managerIds = [],
    } = req.body;
    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
        orgId: req.user.orgId,
      },
    });
    if (project) {
      if (managerIds.length > 0) {
        await prisma.projectManager.createMany({
          data: managerIds.map((managerId: string) => ({
            orgUserId: managerId,
            projectId: project.id,
          })),
        });
      }
      if (imageUrl) {
        await prisma.attachment.create({
          data: {
            fileURL: imageUrl,
            fileName: imageName,
            projectId: project.id,
          },
        });
      }
      res.status(201).json(project);
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating a project: ${error.message}` });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
