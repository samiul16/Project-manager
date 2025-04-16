import { Router } from "express";
import {
  getEmployees,
  createEmployee,
} from "../controllers/employeeController";

const router = Router();

router.get("/", (req, res) => getEmployees(req, res));

router.post("/", (req, res) => createEmployee(req, res));

export default router;
