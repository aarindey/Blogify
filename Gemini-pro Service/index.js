import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { askGemini } from "./simple-text.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.post("/query", async (req, res) => {
  const queryString = req.body.query;

  if (!queryString) {
    return res.status(400).json({ error: "Query string is required" });
  }

  try {
    const response = await askGemini(queryString);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
