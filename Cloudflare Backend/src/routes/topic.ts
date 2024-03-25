import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

const topicRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: { userId: string };
}>();

//Auth middleware
topicRouter.use("/*", async (c, next) => {
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

topicRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const topics = await prisma.topic.findMany({
      orderBy: {
        users: {
          _count: "desc",
        },
      },
      take: 30,
      select: {
        id: true,
        name: true,
      },
    });

    return c.json({
      success: true,
      data: topics,
      message: "Retreival Successful",
    });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Error trying to get all topics!",
    });
  }
});

topicRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const topicId = Number(c.req.param("id"));
    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!topic) {
      throw new Error("Topic not found.");
    }

    // Find the blogs featuring the topic
    const blogs = await prisma.blog.findMany({
      where: {
        topics: {
          some: { id: topicId },
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        date: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Find the users that follow the topic
    const users = await prisma.user.findMany({
      where: {
        topics: {
          some: {
            id: topicId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        bio: true,
      },
    });

    return c.json({
      success: true,
      topic: topic,
      blogs: blogs,
      users: users,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Error trying to get a topic!",
    });
  }
});

topicRouter.get("/:id/follow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const topicId = Number(c.req.param("id"));
    const userId = Number(c.get("userId"));

    // Check if the user with userId follows the topic with topicId
    const topic = await prisma.topic.findUnique({
      where: {
        id: topicId,
      },
      include: {
        users: {
          where: {
            id: userId,
          },
        },
      },
    });

    // If topic is not found or user is not following, return false, else true
    const following = !!topic && !!topic.users.length;

    return c.json({
      following: following,
    });
  } catch (error) {
    console.error("Error checking topic follow status:", error);
    c.status(500);
    return c.json({
      error: "Internal server error",
    });
  }
});

topicRouter.post("/:id/follow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = Number(c.get("userId"));
    const topicId = Number(c.req.param("id"));
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const topic = await prisma.topic.findUnique({ where: { id: topicId } });

    if (!user || !topic) {
      throw new Error("User or topic not found.");
    }

    // Update the user's topics and the topic's users
    await prisma.user.update({
      where: { id: userId },
      data: { topics: { connect: { id: topicId } } },
    });

    await prisma.topic.update({
      where: { id: topicId },
      data: { users: { connect: { id: userId } } },
    });
    return c.json({ success: true, message: "Topic followed Successfully!" });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Error trying to follow Topic!",
    });
  }
});

topicRouter.post("/:id/unfollow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = Number(c.get("userId"));
    const topicId = Number(c.req.param("id"));
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const topic = await prisma.topic.findUnique({ where: { id: topicId } });

    // Update the user's topics and the topic's users
    await prisma.user.update({
      where: { id: userId },
      data: { topics: { disconnect: { id: topicId } } },
    });

    await prisma.topic.update({
      where: { id: topicId },
      data: { users: { disconnect: { id: userId } } },
    });

    return c.json({ success: true, message: "Unfollowed topic successfully!" });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Error trying to unfollow a topic!",
    });
  }
});

export default topicRouter;
