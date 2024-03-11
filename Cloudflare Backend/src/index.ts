import { Hono } from "hono";
import { cors } from "hono/cors";
import userRouter from "./routes/user";
import blogRouter from "./routes/blog";
import topicRouter from "./routes/topic";
import authorRouter from "./routes/author";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("/*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/topic", topicRouter);
app.route("api/v1/author", authorRouter);

export default app;
