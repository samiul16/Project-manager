import { Router } from "express";
import {
  getUsers,
  createOrgUser,
  deleteOrgUser,
} from "../controllers/orgUserController";

const router = Router();

router.get("/", getUsers);
router.post("/", createOrgUser);
router.delete("/", deleteOrgUser);
router.put("/", (req, res) => {});

export default router;
