import { Router } from "express";
import zod from "zod";
import User from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import dotevn from "dotenv";
import {
  signIn,
  signUp,
  getUser,
  logOut,
} from "../controllers/userController.js";
dotevn.config();

const router = Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/logout", logOut);

router.get("/me", authMiddleware, getUser);

export default router;
