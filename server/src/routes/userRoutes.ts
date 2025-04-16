import { getUsers } from "../controllers/userController";
import { Router } from "express";

const router = Router();

router.get("/", getUsers);

export default router;
