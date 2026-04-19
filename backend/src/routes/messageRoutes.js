import express from "express";
import {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadMessages,
  markAsRead,
  markConversationAsRead,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

router.post("/", sendMessage);
router.get("/conversations", getConversations);
router.get("/conversation/:userId", getConversation);
router.get("/unread", getUnreadMessages);
router.put("/:messageId/read", markAsRead);
router.put("/conversation/:userId/read", markConversationAsRead);

export default router;
