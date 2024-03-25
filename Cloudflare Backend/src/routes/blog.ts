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
        imageName: body.imageName,
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

blogRouter.put("/update", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const validatedBody = blogUpdateBody.safeParse(body);
    if (!validatedBody.success) {
      c.status(411);
      return c.json({
        success: false,
        message: "Zod Validation falied!",
      });
    }

    const blogId = Number(body.id);

    // Update blog title and content
    const updateData: { title: string; content: string; imageName?: string } = {
      title: body.title,
      content: body.content,
    };

    if (body.imageName !== "" && body.imageName !== null) {
      updateData.imageName = body.imageName;
    }

    // Update blog title and content
    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: updateData,
      include: {
        topics: true, // Include associated topics
      },
    });

    // Get the existing topic names associated with the blog
    const existingTopics = await prisma.topic.findMany({
      where: {
        name: {
          in: body.topics.map(
            (topic: { id: number; name: string }) => topic.name
          ),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Create a map of existing topic names to their IDs
    const existingTopicMap: Record<string, number> = {};
    existingTopics.forEach((topic) => {
      existingTopicMap[topic.name] = topic.id;
    });

    // Determine topics to be added and deleted
    const updatedTopicNames = body.topics.map(
      (topic: { id: number; name: string }) => topic.name
    );
    const topicsToAdd = updatedTopicNames.filter(
      (topicName: string) => !existingTopicMap.hasOwnProperty(topicName)
    );
    const topicsToDelete = updatedBlog.topics.filter(
      (topic) => !updatedTopicNames.includes(topic.name)
    );

    // Create new topics and associate them with the blog
    await Promise.all(
      topicsToAdd.map(async (topicName: string) => {
        await prisma.topic.create({
          data: {
            name: topicName,
            blogs: {
              connect: {
                id: blogId,
              },
            },
          },
        });
      })
    );

    // Connect existing topics to the blog
    await Promise.all(
      existingTopics.map(async (topic) => {
        await prisma.topic.update({
          where: { id: topic.id },
          data: {
            blogs: {
              connect: {
                id: blogId,
              },
            },
          },
        });
      })
    );

    // Disconnect topics that are no longer associated with the blog
    await Promise.all(
      topicsToDelete.map(async (topic) => {
        await prisma.topic.update({
          where: { id: topic.id },
          data: {
            blogs: {
              disconnect: {
                id: blogId,
              },
            },
          },
        });
      })
    );

    return c.json({
      message: "Blog successfully updated!",
      data: updatedBlog,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      error: error,
      message: "Error trying to update a blog!",
    });
  } finally {
    await prisma.$disconnect(); // Disconnect from the database after finishing the operation
  }
});

blogRouter.delete("/delete/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogId = Number(c.req.param("id"));

    // Find the blog to delete
    const blogToDelete = await prisma.blog.findUnique({
      where: { id: blogId },
      include: { topics: true }, // Include associated topics
    });

    if (!blogToDelete) {
      c.status(404);
      return c.json({ message: "Blog not found" });
    }

    // Delete associations with topics
    await prisma.blog.update({
      where: { id: blogId },
      data: {
        topics: {
          disconnect: blogToDelete.topics, // Disconnect all associated topics
        },
      },
    });

    // Delete the blog
    await prisma.blog.delete({ where: { id: blogId } });

    // Delete topics that are no longer associated with any blog
    const topicsToDelete = await prisma.topic.findMany({
      where: { blogs: { none: {} } }, // Find topics with no associated blogs
    });

    if (topicsToDelete.length > 0) {
      await prisma.topic.deleteMany({
        where: { id: { in: topicsToDelete.map((topic) => topic.id) } },
      });
    }

    return c.json({ message: "Blog successfully deleted" });
  } catch (error) {
    c.status(500);
    return c.json({
      error: error,
      message: "Error trying to delete a blog!",
    });
  } finally {
    await prisma.$disconnect(); // Disconnect from the database after finishing the operation
  }
});

// Todo: Pagination
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const page = Number(c.req.query("page"));
    const limit = Number(c.req.query("limit"));
    const offset = (page - 1) * limit;
    const blogs = await prisma.blog.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        date: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      skip: offset,
      take: limit,
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
        date: true,
        author: {
          select: {
            name: true,
            bio: true,
            id: true,
          },
        },
        topics: true,
        imageName: true,
      },
    });
    return c.json({ data: blog });
  } catch (error) {
    return c.json({ error: error, message: "Error trying to get a blog!" });
  }
});

export default blogRouter;

// Comments endpoint
blogRouter.post("/:id/comments", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const id = Number(c.req.param("id"));
    const body = await c.req.json();
    const { content, parentId } = body;
    const authorId = Number(c.get("userId"));

    // Check if the blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id: id },
    });

    if (!existingBlog) {
      c.status(404);
      return c.json({ success: false, error: "Blog not found" });
    }

    const data: any = {
      content: content,
      author: {
        connect: { id: authorId }, // Connects the comment to the author
      },
      blog: {
        connect: { id: id }, // Connects the comment to the blog
      },
    };

    if (parentId !== null && parentId !== undefined) {
      data.parent = {
        connect: { id: parentId },
      };
    }

    const comment = await prisma.comment.create({
      data: data,
      include: {
        author: true, // Include the author object
      },
    });

    c.status(201);
    return c.json({ success: true, data: comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    c.status(500);
    return c.json({ success: false, error: "Internal server error" });
  }
});

blogRouter.get("/:id/comments", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogId = Number(c.req.param("id"));
  try {
    const comments = await prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        author: true,
        parentId: true,
        parent: true,
        replies: true,
      },
      where: {
        blogId: blogId,
      },
    });

    return c.json({ data: comments });
  } catch (error) {
    return c.json({ error: error, message: "Error trying to get comments!" });
  }
});

//endpoints consider that only base-level comments exist
blogRouter.delete("/:blogId/comments/:commentId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const commentId = Number(c.req.param("commentId"));

  try {
    // Check if the comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      c.status(404);
      return c.json({ success: false, error: "Comment not found" });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    c.status(200);
    return c.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    c.status(500);
    return c.json({ success: false, error: "Internal server error" });
  }
});

blogRouter.put("/:blogId/comments/:commentId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const commentId = Number(c.req.param("commentId"));
  const body = await c.req.json();
  const { content } = body;

  try {
    // Check if the comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true }, // Include author information
    });

    if (!existingComment) {
      c.status(404);
      return c.json({ success: false, error: "Comment not found" });
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content },
      include: { author: true }, // Include author information
    });

    c.status(200);
    return c.json({ success: true, data: updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    c.status(500);
    return c.json({ success: false, error: "Internal server error" });
  }
});
