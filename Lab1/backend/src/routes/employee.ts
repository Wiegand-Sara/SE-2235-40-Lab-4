import { Router } from "express";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "../controllers/employeeController";

const router = Router();

router.get("/", getEmployees as any);
router.post("/", addEmployee as any);
router.put("/:id", updateEmployee as any);
router.delete("/:id", deleteEmployee as any);

export default router;
