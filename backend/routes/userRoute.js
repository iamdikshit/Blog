import express from "express";
import { getUser } from "../controller/userController.js";
import {
  signUp,
  signIn,
  activate,
  logout,
  forgot,
  resetPassword,
  protect,
  restrict,
} from "../controller/auth/authController.js";

const router = express.Router();

// SignUp
router.post("/signup", signUp);
router.post("/signin", signIn);
// signUp for Admin
router.post("/signin/:admin", signIn);
router.get("/logout", logout);
router.post("/forgot", forgot);
router.post("/reset/:token", resetPassword);
router.get("/activate/:token", activate);

// /user
// protect user routes
router.use(protect);
// restrict user route
router.use(restrict("admin", "employee"));
router.get("/", getUser);

export default router;
