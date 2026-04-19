import express from "express";
import {
  getMyClients,
  getClientById,
  removeClient,
  updateClient,
} from "../controllers/trainerController.js";
import { protect, trainerOnly } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected and trainer-only
router.use(protect, trainerOnly);

router.get("/clients", getMyClients);
router.get("/clients/:clientId", getClientById);
router.put("/clients/:clientId", updateClient);
router.delete("/clients/:clientId", removeClient);

export default router;
