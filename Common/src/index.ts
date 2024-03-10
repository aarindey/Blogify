import z from "zod";

export const signUpBody = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  bio: z.string().optional(),
});

export const signInBody = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

export const blogPostBody = z.object({
  title: z.string(),
  content: z.string(),
  topics: z.array(z.string()),
});

export const blogUpdateBody = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
});

export type SignUpBody = z.infer<typeof signUpBody>;
export type SignInBody = z.infer<typeof signInBody>;
export type BlogPostBody = z.infer<typeof blogPostBody>;
export type BlogUpdateBody = z.infer<typeof blogUpdateBody>;
