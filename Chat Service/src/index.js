import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connect from "./services/db.js";
import rootRouter from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use("/api/v1", rootRouter);

connect().then(() => {
  app.listen(port, () => {
    console.log(`[server]:Server is running at http://localhost:${port}`);
  });
});
