import express from "express";
import {
  createProgram,
  getMyPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
  getMyActiveProgram,
  getClientPrograms,
} from "../controllers/programController.js";
import { protect, trainerOnly, clientOnly } from "../middleware/auth.js";

const router = express.Router();

// Trainer routes
router.post("/", protect, trainerOnly, createProgram);
router.get("/", protect, trainerOnly, getMyPrograms);
router.get("/client/:clientId", protect, trainerOnly, getClientPrograms);
router.put("/:programId", protect, trainerOnly, updateProgram);
router.delete("/:programId", protect, trainerOnly, deleteProgram);

// Client routes
router.get("/my/active", protect, clientOnly, getMyActiveProgram);

// Shared routes
router.get("/:programId", protect, getProgramById);

export default router;
