import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controllers/messageController.js";

const router = Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getConversations);
router.get("/:otherUserId", authMiddleware, getMessages);

export default router;
