import { Router } from "express";
import zod from "zod";
import User from "../models/userModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import jwt from "jsonwebtoken";
import dotevn from "dotenv";
dotevn.config();

const router = Router();

const signupReqBody = zod.object({
  username: zod.string().email(),
  name: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  // Request body check
  const validatedReq = signupReqBody.safeParse(req.body);
  if (!validatedReq.success) {
    return res.status(411).json({
      message: "Incorrect Inputs",
    });
  }

  // Db check
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(411).json({
      message: "User already present",
    });
  }

  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
    });

    const id = user._id;
    const token = jwt.sign({ userid: id }, process.env.JWT_SECRET);
    res.status(200).json({
      message: "Sign up successful",
      token: token,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const signinReqBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", authMiddleware, async (req, res) => {
  // Request Body Check
  const validatedReq = signinReqBody.safeParse(req.body);
  if (!validatedReq.success) {
    return res.status(411).json({ message: "Incorrect Inputs" });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (user) {
    const userid = user._id;
    const token = jwt.sign({ userid: userid }, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Login Successful", token: token });
  }

  res.status(411).json({ message: "Error while logging in" });
});

// A custom type for the Request object
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userid = req.userid;
    const user = await User.find({ _id: userid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal server error" });
  }
});

export default router;
