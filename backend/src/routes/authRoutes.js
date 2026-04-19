import express from "express";
import {
  registerTrainer,
  registerClient,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/trainer/register", registerTrainer);
router.post("/client/register", registerClient);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

export default router;
