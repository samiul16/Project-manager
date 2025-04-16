import { Router } from "express";
import {
  getProjects,
  createProject,
  getProjectById,
  deleteProject,
} from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.delete("/:id", deleteProject);

export default router;
