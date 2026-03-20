import express from "express";
import {
  checkLoggedIn,
  createAccount,
  login,
} from "../controllers/authController.js";
import {
  signupValidation,
  loginValidation,
  isLoggedIn,
} from "../middlewares/authValidator.js";

const router = express.Router();

router.post("/create-account", signupValidation, createAccount);
router.post("/login", loginValidation, login);
router.get("/checkloggedin", checkLoggedIn);
// router.get("/logout", isLoggedIn, logout);

export default router;
