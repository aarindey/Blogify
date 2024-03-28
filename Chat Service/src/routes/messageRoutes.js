import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import sendMessage from "../controllers/messageController.js";

const router = Router();

router.get("/", (req, res) => {
  return res.json({ message: "Get request Success" });
});

router.post("/", authMiddleware, sendMessage);

export default router;
