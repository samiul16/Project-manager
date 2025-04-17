import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust type according to your User model
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check for Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // 2. Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      orgId: string;
      roleId: string;
      iat: number;
      exp: number;
    };

    // 3. Find user in database
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      include: {
        organizationUsers: {
          where: {
            orgId: decoded.orgId,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!decoded.orgId) {
      return res
        .status(401)
        .json({ error: "Organization ID not found in token" });
    }

    // user.organizationId = decoded.orgId;

    // 4. Attach user to request object
    req.user = {
      orgUserId: user.organizationUsers[0].id,
      userId: user.userId,
      roleId: decoded.roleId,
      orgId: user.organizationUsers[0].orgId,
    };

    // 5. Proceed to next middleware
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    return res.status(500).json({ error: "Authentication failed" });
  }
};
