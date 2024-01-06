import express from "express";
import {
  getOneUser,
  getUser,
  updateMe,
  getMe,
  updateUser,
  deleteUser,
  deleteMe,
} from "../controller/userController.js";
import { imagePreProcessing, uploadImage } from "../utils/imageUploader.js";
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
router.patch(
  "/updateme",
  getMe,
  uploadImage,
  imagePreProcessing("user", { width: 500, height: 500 }),
  updateMe
);
router.get("/me", getMe, getOneUser);
router.delete("/deleteMe", deleteMe);
// Only for admin and employee
router.use(restrict("admin", "employee"));
router.get("/", getUser);
router.get("/:id", getOneUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
