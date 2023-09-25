import express from "express";
import { getUser } from "../controller/userController.js";

const router = express.Router();

// /user
router.get("/", getUser);

export default router;
