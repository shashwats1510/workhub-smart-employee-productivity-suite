import express from "express";
import { createAccount, login } from "../controllers/authController.js";
import { signupValidation, loginValidation } from "../middlewares/authValidator.js";

const router = express.Router();

router.post("/create-account", signupValidation, createAccount);
router.post("/login", loginValidation, login);
// router.get("/logout", logout);

export default router;
