import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signUpBody, signInBody } from "@aarindey/medium-zod-common";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const validatedBody = signUpBody.safeParse(body);
    if (!validatedBody.success) {
      c.status(411);
      return c.json({ message: "Zod Validation failed!" });
    }
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name,
        bio: body.bio,
      },
    });

    const payload = {
      id: user.id,
    };
    const secret = c.env.JWT_SECRET;
    const token = await sign(payload, secret);
    return c.json({
      message: "Sign Up Successful",
      token: token,
    });
  } catch (error) {
    c.status(411);
    return c.json({ error: error, message: "Invalid Request!" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const validatedBody = signInBody.safeParse(body);
    if (!validatedBody.success) {
      c.status(411);
      return c.json({ message: "Zod Validation failed!" });
    }
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password,
      },
    });
    if (!user) {
      c.status(403);
      return c.json({ message: "User unauthorized!" });
    }
    const secret = c.env.JWT_SECRET;
    const token = await sign(
      {
        id: user.id,
      },
      secret
    );
    return c.json({ message: "Sign In Successful!", token: token });
  } catch (error) {
    return c.json({
      error: error,
      message: "Unauthorized!",
    });
  }
});

export default userRouter;
