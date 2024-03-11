import { useEffect } from "react";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Navbar } from "../components/Navbar";
import { useBlogs } from "../hooks";
import { SideBar } from "../components/SideBar";

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
          <Navbar />
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
      <Navbar />
      <div className="flex mt-[4.5rem] justify-center">
        <div className="w-full mx-4 md:m-0 md:w-3/4">
          {blogs.length > 0 ? (
            blogs.map((blog: Blog) => (
              <BlogCard
                key={blog.id} // Remember to add a unique key for each mapped element
                id={blog.id}
                authorName={blog.author.name}
                title={blog.title}
                content={blog.content}
                publishedDate="21st Jan 2023"
              />
            ))
          ) : (
            <div className="flex justify-center h-screen mt-10 font-extralight text-xl">
              {" "}
              <p>No Blogs Present</p>
            </div>
          )}
        </div>
        <div className="w-1/4 md:mr-7 hidden md:block">
          <SideBar type={"general"} />
        </div>
      </div>
    </div>
  );
};
