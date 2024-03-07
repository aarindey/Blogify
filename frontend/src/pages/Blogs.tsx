import { useEffect } from "react";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Navbar } from "../components/Navbar";
import { useBlogs } from "../hooks";

interface Blog {
  content: string;
  title: string;
  id: number;
  author: {
    name: string;
  };
}

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  useEffect(() => {
    document.title = "Blogify | Feed";
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="block overflow-visible">
          {" "}
          <Navbar></Navbar>
        </div>

        <div className="h-screen flex mt-[5rem] flex-col justify-center items-center">
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
          <BlogSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Navbar></Navbar>
      <div className="flex mt-[5rem] justify-center">
        <div>
          {blogs.map((blog: Blog) => (
            <BlogCard
              id={blog.id}
              authorName={blog.author.name}
              title={blog.title}
              content={blog.content}
              publishedDate="21st Jan 2023"
            ></BlogCard>
          ))}
        </div>
      </div>
    </div>
  );
};
