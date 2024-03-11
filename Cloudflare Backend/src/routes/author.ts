import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

const authorRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

//Auth middleware
authorRouter.use("/*", async (c, next) => {
  const token = c.req.header("authorization") || "";
  try {
    const user = await verify(token, c.env.JWT_SECRET);
    if (user) {
      c.set("userId" as any, user.id);
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

authorRouter.get("/me", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: c.get("userId" as any),
      },
      select: {
        id: true,
        name: true,
      },
    });

    return c.json({
      success: true,
      user: user,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Error trying to get current user!",
    });
  }
});

authorRouter.get("/elite", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        bio: true,
      },
    });

    return c.json({
      success: true,
      users: users,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Error trying to get top authors!",
    });
  }
});

authorRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const authorId = Number(c.req.param("id"));
    const author = await prisma.user.findFirst({
      where: {
        id: authorId,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        blogs: {
          select: {
            id: true,
            title: true,
            content: true,
          },
        },
        topics: {
          select: { id: true, name: true },
        },
        following: {
          select: {
            id: true,
            name: true,
            bio: true,
          },
        },
        followers: {
          select: {
            id: true,
            name: true,
            bio: true,
          },
        },
      },
    });

    if (!author) {
      throw new Error("Author not found.");
    }

    return c.json({
      success: true,
      author: author,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Error trying to get a Author!",
    });
  }
});

authorRouter.get("/:id/follow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const followerId = Number(c.get("userId" as any));
    const userId = Number(c.req.param("id"));

    // Check if the follower with followerId follows the user with userId
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        followers: {
          where: {
            id: followerId,
          },
        },
      },
    });

    // If user is not found or follower is not following, return false, else true
    const following = !!user && !!user.followers.length;

    return c.json({
      following: following,
    });
  } catch (error) {
    console.error("Error checking user follow status:", error);
    c.status(500);
    return c.json({
      error: "Internal server error",
    });
  }
});

authorRouter.post("/:id/follow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const followerId = Number(c.get("userId" as any));
    const userId = Number(c.req.param("id"));
    const follower = await prisma.user.findUnique({
      where: { id: followerId },
    });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!follower || !user) {
      throw new Error("Follower or user not found.");
    }

    // Update the follower's following and the user's followers
    await prisma.user.update({
      where: { id: followerId },
      data: { following: { connect: { id: userId } } },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { followers: { connect: { id: followerId } } },
    });

    return c.json({ success: true, message: "User followed successfully!" });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Error trying to follow user!",
    });
  }
});

authorRouter.post("/:id/unfollow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const followerId = Number(c.get("userId" as any));
    const userId = Number(c.req.param("id"));
    const follower = await prisma.user.findUnique({
      where: { id: followerId },
    });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Update the follower's following and the user's followers
    await prisma.user.update({
      where: { id: followerId },
      data: { following: { disconnect: { id: userId } } },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { followers: { disconnect: { id: followerId } } },
    });

    return c.json({ success: true, message: "Unfollowed user successfully!" });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      error: error,
      message: "Error trying to unfollow a user!",
    });
  }
});

export default authorRouter;
