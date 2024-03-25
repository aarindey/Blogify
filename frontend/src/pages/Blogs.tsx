/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Navbar } from "../components/Navbar";
import { useBlogs } from "../hooks";
import { SideBar } from "../components/SideBar";

interface Blog {
  content: string;
  title: string;
  id: number;
  date: string;
  author: {
    name: string;
  };
}

export const Blogs = () => {
  // State variable to hold the current page
  const [currentPage, setCurrentPage] = useState(1);

  // Event handler to update the current page when the slider is moved
  const handleClick = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
  };

  const { loading, setLoading, blogs } = useBlogs({
    page: currentPage,
    limit: 5,
  });

  useEffect(() => {
    document.title = "Blogify | Feed";
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col">
        <Navbar />
        <div className="flex mt-[4.5rem] justify-center">
          <div className="w-full mx-4 md:m-0 md:w-3/4 py-2 pl-7">
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
          <div className="w-1/4 md:mr-7 hidden md:block">
            <SideBar type={"general"} />
          </div>
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
            blogs.map((blog: Blog) => {
              return (
                <BlogCard
                  key={blog.id} // Remember to add a unique key for each mapped element
                  id={blog.id}
                  authorName={blog.author.name}
                  title={blog.title}
                  content={blog.content}
                  publishedDate={blog.date.split("T")[0]}
                />
              );
            })
          ) : (
            <div className="flex justify-center h-screen mt-10 font-extralight text-xl">
              {" "}
              <p>No Blogs Present</p>
            </div>
          )}
          <div className="flex justify-center mt-8">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-1 cursor-pointer 
            ${currentPage === index + 1 ? "bg-blue-500" : "bg-gray-300"}
          `}
                onClick={() => handleClick(index + 1)}
              ></div>
            ))}
          </div>
        </div>
        <div className="w-1/4 md:mr-7 hidden md:block">
          <SideBar type={"general"} />
        </div>
      </div>
    </div>
  );
};
