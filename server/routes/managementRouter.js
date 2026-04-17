import express from "express";
import {
  applyForLeave,
  getEmployees,
  getUserTasks,
  markAttendance,
  toggleTaskStatus,
  createTask
} from "../controllers/managementController.js";
import { isLoggedIn } from "../middlewares/authValidator.js";

const router = express.Router();

router.post("/applyforleave", isLoggedIn, applyForLeave);
router.post("/markAttendance", isLoggedIn, markAttendance);
router.post("/toggleTask", isLoggedIn, toggleTaskStatus);
router.post("/createTask", isLoggedIn, createTask);

router.get("/getUserTasks", isLoggedIn, getUserTasks);
router.get("/getEmployees", isLoggedIn, getEmployees);


export default router;
