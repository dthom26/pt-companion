import express from "express";
import {
  createWorkout,
  getMyWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";
import { protect, trainerOnly } from "../middleware/auth.js";

const router = express.Router();

// Trainer routes
router.post("/", protect, trainerOnly, createWorkout);
router.get("/", protect, trainerOnly, getMyWorkouts);
router.put("/:workoutId", protect, trainerOnly, updateWorkout);
router.delete("/:workoutId", protect, trainerOnly, deleteWorkout);

// Shared routes
router.get("/:workoutId", protect, getWorkoutById);

export default router;
