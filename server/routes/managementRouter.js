import express from "express";
import {
  applyForLeave,
  getEmployees,
  getUserTasks,
  markAttendance,
  toggleTaskStatus,
  createTask,
  editUserDetails
} from "../controllers/managementController.js";
import { isLoggedIn } from "../middlewares/authValidator.js";

const router = express.Router();

router.post("/applyforleave", isLoggedIn, applyForLeave);
router.post("/markAttendance", isLoggedIn, markAttendance);
router.put("/toggleTask", isLoggedIn, toggleTaskStatus);
router.post("/createTask", isLoggedIn, createTask);
router.post("/editUserDetails", isLoggedIn, editUserDetails);

router.get("/getUserTasks", isLoggedIn, getUserTasks);
router.get("/getEmployees", isLoggedIn, getEmployees);

export default router;
