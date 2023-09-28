import express from "express";
import { getUser } from "../controller/userController.js";
import { signUp, signIn, activate } from "../controller/auth/authController.js";

const router = express.Router();

// /user
router.get("/", getUser);

// SignUp
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/activate/:token", activate);

export default router;
