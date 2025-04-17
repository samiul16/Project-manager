import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  getUserTasks,
  getTaskById,
} from "../controllers/taskController";
import {
  createTaskChecklist,
  getTaskCheckLists,
  updateTaskChecklist,
} from "../controllers/taskCheckListController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);
router.get("/user/:userId", getUserTasks);
router.patch("/:taskId", updateTask);
router.get("/:taskId", getTaskById);
router.post("/:taskId/checklist", createTaskChecklist);
router.patch("/checklist/:checklistId", updateTaskChecklist);
router.get("/:taskId/checklist", getTaskCheckLists);
export default router;
