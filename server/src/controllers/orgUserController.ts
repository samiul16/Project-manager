import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const orgUsers = await prisma.organizationUser.findMany({
      where: {
        orgId: req.user.orgId,
      },
      include: {
        user: true,
      },
    });
    res.status(200).json(orgUsers);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createOrgUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phoneNumber, roles } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      const existingOrgUser = await prisma.organizationUser.findUnique({
        where: {
          userId_orgId: {
            userId: existingUser.userId,
            orgId: req.user.orgId,
          },
        },
      });
      if (existingOrgUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      const orgUser = await prisma.organizationUser.create({
        data: {
          userId: existingUser.userId,
          orgId: req.user.orgId,
        },
      });
      const existingRoles = await prisma.role.findMany({
        where: {
          name: { in: roles },
        },
      });

      if (!existingRoles) {
        return res.status(404).json({ message: "Role not found" });
      }

      const orgRoles = await prisma.orgUserRole.createMany({
        data: existingRoles.map((role) => ({
          orgUserId: orgUser.id,
          roleId: role.id,
          orgId: req.user.orgId,
        })),
      });
      res.status(200).json(orgUser);
    } else {
      const phone = phoneNumber.replace(/\D/g, "");
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
        },
      });
      const orgUser = await prisma.organizationUser.create({
        data: {
          userId: user.userId,
          orgId: req.user.orgId,
        },
      });
      const existingRoles = await prisma.role.findMany({
        where: {
          name: { in: roles },
        },
      });
      if (!existingRoles) {
        return res.status(404).json({ message: "Role not found" });
      }
      const orgRoles = await prisma.orgUserRole.createMany({
        data: existingRoles.map((role) => ({
          orgUserId: orgUser.id,
          roleId: role.id,
          orgId: req.user.orgId,
        })),
      });
      res.status(200).json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrgUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.organizationUser.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Organization user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
