import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlog,
  updateBlog,
  getOneBlog,
} from "../controller/blogController.js";

import { imagePreProcessing, uploadImage } from "../utils/imageUploader.js";

import { updateLike } from "../controller/likeController.js";

import { protect, restrict } from "../controller/auth/authController.js";
import {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
  getOneComment,
} from "../controller/commentController.js";
const router = express.Router();

router.get("/", getAllBlog);
router.get("/:id", getOneBlog);
router.post(
  "/",
  protect,
  restrict("admin", "employee"),
  uploadImage,
  imagePreProcessing("blog", { width: 1200, height: 630 }),
  createBlog
);
router.patch(
  "/:id",
  protect,
  restrict("admin", "employee"),
  uploadImage,
  imagePreProcessing("blog", { width: 1200, height: 630 }),
  updateBlog
);
router.delete("/:id", protect, restrict("admin", "employee"), deleteBlog);

// Routes for like

router.get("/like/:id", protect, updateLike);

// Routes for Comments
router.use(protect);
router.get("/comment/all", getAllComments);
router.get("/comment/:id", getOneComment);
router.post("/comment/", createComment);
router.patch("/comment/:id", updateComment);
router.delete("/comment/:id", deleteComment);

export default router;
