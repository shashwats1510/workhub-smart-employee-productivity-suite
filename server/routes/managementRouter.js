import express from "express";
import {
  applyForLeave,
  getUserTasks,
  markAttendance,
  toggleTaskStatus,
} from "../controllers/managementController.js";
import { isLoggedIn } from "../middlewares/authValidator.js";

const router = express.Router();

router.post("/applyforleave", isLoggedIn, applyForLeave);
router.post("/markAttendance", isLoggedIn, markAttendance);
router.post("/toggleTask", isLoggedIn, toggleTaskStatus);
router.get("/getUserTasks", isLoggedIn, getUserTasks);

export default router;
