import express from "express";
import {
  createCategory,
  getAllCategory,
  updateCategoryByID,
  deleteCategory,
} from "../controller/categoryController.js";
import { protect, restrict } from "../controller/auth/authController.js";
const router = express.Router();

// Auth
router.use(protect);
router.use(restrict("admin", "employee"));
router.post("/", createCategory);
router.get("/", getAllCategory);
router.patch("/:id", updateCategoryByID);
router.delete("/:id", deleteCategory);

export default router;
