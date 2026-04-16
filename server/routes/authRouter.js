import express from "express";
import {
  checkLoggedIn,
  editUser,
  createAccount,
  login,
  logout,
  deleteUser,
} from "../controllers/authController.js";
import {
  signupValidation,
  loginValidation,
  isLoggedIn,
} from "../middlewares/authValidator.js";

const router = express.Router();

router.post("/login", loginValidation, login);
router.get("/checkloggedin", checkLoggedIn);
router.post("/logout", isLoggedIn, logout);

router.post("/create-account", signupValidation, createAccount);
router.post("/editUserDetails", isLoggedIn, editUser);
router.get("/deleteUser", isLoggedIn, deleteUser);
// router.get("/logout", isLoggedIn, logout);

export default router;
