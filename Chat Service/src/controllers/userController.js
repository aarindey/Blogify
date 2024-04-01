import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import zod from "zod";
import dotenv from "dotenv";

dotenv.config();

const signinReqBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

const signupReqBody = zod.object({
  username: zod.string().email(),
  name: zod.string(),
  password: zod.string(),
});

export const signUp = async (req, res) => {
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
    res.cookie("token", token, {
      domain: "localhost",
      secure: false,
    });
    res.status(200).json({
      message: "Sign up successful",
      token: token,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = async (req, res) => {
  // Request Body Check
  const validatedReq = signinReqBody.safeParse(req.body);
  if (!validatedReq.success) {
    return res.status(411).json({ message: "Incorrect Inputs" });
  }
  try {
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!user) {
      return res.status(404).json({ message: "No such user" });
    }
    if (user) {
      const userid = user._id;
      const token = jwt.sign({ userid: userid }, process.env.JWT_SECRET);
      res.cookie("token", token, {
        domain: "localhost",
        secure: false,
      });
      return res
        .status(200)
        .json({ message: "Login Successful", token: token });
    }
  } catch (error) {
    res.status(500).json({ error: error, message: "Error while logging in" });
  }
};

export const logOut = async (req, res) => {
  try {
    res.cookie("token", "");
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(401).json({
      message: "Logout not successful",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userid = req.userid;
    const user = await User.findById(userid).select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error, message: "Internal server error" });
  }
};
