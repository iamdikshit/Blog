import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  updateBlog,
} from "../controller/blogController.js";

import { protect, restrict } from "../controller/auth/authController.js";
const router = express.Router();

router.get("/", getAllBlog);

router.use(protect, restrict("admin", "employee"));
router.post("/", createBlog);
router.patch("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;
