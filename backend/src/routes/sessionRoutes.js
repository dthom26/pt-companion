import express from "express";
import {
  startSession,
  updateExerciseInSession,
  completeSession,
  getMySessions,
  getSessionById,
  getClientSessions,
} from "../controllers/sessionController.js";
import { protect, clientOnly, trainerOnly } from "../middleware/auth.js";

const router = express.Router();

// Client routes
router.post("/", protect, clientOnly, startSession);
router.get("/", protect, clientOnly, getMySessions);
router.put(
  "/:sessionId/exercises/:exerciseId",
  protect,
  clientOnly,
  updateExerciseInSession
);
router.put("/:sessionId/complete", protect, clientOnly, completeSession);

// Trainer routes
router.get("/client/:clientId", protect, trainerOnly, getClientSessions);

// Shared routes
router.get("/:sessionId", protect, getSessionById);

export default router;
