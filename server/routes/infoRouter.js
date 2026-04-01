import express from "express";
import { isLoggedIn } from "../middlewares/authValidator.js";
import { getAllUsers } from "../controllers/infoController.js";

const router = express.Router();

router.get("/get-all-users", isLoggedIn, getAllUsers);

export default router;
