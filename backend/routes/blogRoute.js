import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  updateBlog,
  uploadImage,
  resizeImage,
} from "../controller/blogController.js";

import { updateLike } from "../controller/likeController.js";

import { protect, restrict } from "../controller/auth/authController.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
} from "../controller/commentController.js";
const router = express.Router();

router.get("/", getAllBlog);

router.post(
  "/",
  protect,
  restrict("admin", "employee"),
  uploadImage,
  resizeImage,
  createBlog
);
router.patch(
  "/:id",
  protect,
  restrict("admin", "employee"),
  uploadImage,
  resizeImage,
  updateBlog
);
router.delete("/:id", protect, restrict("admin", "employee"), deleteBlog);

// Routes for like

router.get("/like/:id", protect, updateLike);

// Routes for Comments
router.use(protect);
router.post("/comment", createComment);
router.patch("/comment/:id", updateComment);
router.delete("/comment/:id", deleteComment);
router.get("/comment", getAllComments);

export default router;
