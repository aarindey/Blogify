import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";
import { blogPostBody, blogUpdateBody } from "@aarindey/medium-zod-common";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: { userId: string };
}>();

//Auth middleware
blogRouter.use("/*", async (c, next) => {
  const token = c.req.header("authorization") || "";
  try {
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        message: "Unauthorized",
      });
    }
  } catch (error) {
    c.status(403);
    return c.json({ message: "Unauthorized! You are not logged In" });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const validatedBody = blogPostBody.safeParse(body);
    if (!validatedBody.success) {
      c.status(411);
      return c.json({ message: "Zod Validation failed!" });
    }

    const authorId = c.get("userId");
    // Create the blog post
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
        topics: {
          connectOrCreate: body.topics.map((topic: string) => ({
            where: { name: topic.trim().toLowerCase() }, // Ensure topics are trimmed and lowercase
            create: { name: topic.trim().toLowerCase() },
          })),
        },
      },
    });
    return c.json({
      success: true,
      id: blog.id,
      message: "Blog successfully created!",
    });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Blog creation failed",
    });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const validatedBody = blogUpdateBody.safeParse(body);
    if (!validatedBody.success) {
      c.status(411);
      return c.json({ message: "Zod Validation failed!" });
    }
    const blog = await prisma.blog.update({
      where: { id: body.id },
      data: { title: body.title, content: body.content },
    });
    return c.json({
      message: "Blog successfully updated!",
      data: blog,
    });
  } catch (error) {
    c.status(500);
    return c.json({ error: error, message: "Error trying to update a blog!" });
  }
});

// Todo: Pagination
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json({ data: blogs });
  } catch (error) {
    return c.json({ error: error, message: "Error trying to get all blogs!" });
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const id = Number(c.req.param("id"));
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
            bio: true,
            id: true,
          },
        },
        topics: true,
      },
    });
    return c.json({ data: blog });
  } catch (error) {
    return c.json({ error: error, message: "Error trying to get a blog!" });
  }
});

export default blogRouter;
