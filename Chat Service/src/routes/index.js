import { Router } from "express";
import messageRouter from "./messageRoutes.js";
import userRouter from "./userRoutes.js";

const router = Router();

router.use("/user", userRouter);
router.use("/chat", messageRouter);
export default router;
