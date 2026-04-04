import express from "express";
import { isLoggedIn } from "../middlewares/authValidator.js";
import { getAllUsers, getUserDetails } from "../controllers/infoController.js";

const router = express.Router();

router.get("/getAllUsers", isLoggedIn, getAllUsers);
router.get("/getUserDetails", getUserDetails);

export default router;
