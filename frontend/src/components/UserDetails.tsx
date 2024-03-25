import { useEffect, useState } from "react";
import { BlogCard } from "./BlogCard";
import { Navbar } from "./Navbar";
import { UserHeader } from "./UserHeader";
import { UserSideBar } from "./UserSideBar";
import { BlogSkeleton } from "./BlogSkeleton";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface Blog {
  id: number;
  title: string;
  content: string;
  date: string;
  author: {
    id?: number;
    name: string;
    bio: string;
  };
  topics?: {
    id?: number;
    name?: string;
  }[];
}

export const UserDetails = ({
  id,
  name,
  bio,
  topics,
  followers,
  following,
}: {
  id: number | undefined;
  name?: string;
  bio?: string;
  topics?: { id: number; name: string }[];
  followers?: { id: number; name: string; bio: string }[];
  following?: { id: number; name: string; bio: string }[];
  users?: { id: number; name: string; bio: string }[];
}) => {
  // State variable to hold the current page
  const [currentPage, setCurrentPage] = useState(1);

  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pages, setPages] = useState<number>(1);
  const [blogsCount, setBlogsCount] = useState<number>();

  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/author/${id}/blogs?page=${currentPage}&limit=4`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setBlogs(response.data.blogs);
        setPages(response.data.totalPages);
        setBlogsCount(response.data.blogsCount);
        setBlogsLoading(false);
      });
  }, [id, currentPage]);

  // Event handler to update the current page when the slider is moved
  const handleClick = (page: number) => {
    setCurrentPage(page);
    setBlogsLoading(true);
  };
  return (
    <div className="flex flex-col">
      <Navbar></Navbar>
      <UserHeader
        id={id}
        name={name}
        bio={bio}
        followers={followers?.length}
        following={following?.length}
        stories={blogsCount || 0}
      />
      {(blogs?.length || 0) > 0 && (
        <div className="mx-8 mt-2 text-left text-slate-700 font-extralight text-xl">
          Blogs by {name}
        </div>
      )}
      <div className="flex w-full mt-4">
        <div className="w-full mx-4 md:m-0 md:w-3/4">
          {blogsLoading ? (
            <>
              <div className="w-full mx-4 md:m-0  py-2 pl-7">
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
              </div>
            </>
          ) : (blogs || []).length > 0 ? (
            blogs?.map((blog) => (
              <BlogCard
                key={blog.id} // Remember to add a unique key for each mapped element
                id={blog.id}
                authorName={name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={blog.date.split("T")[0]}
              />
            ))
          ) : (
            <div className="flex justify-center items-center h-2/3 mt-10 font-extralight text-xl">
              {" "}
              <p>No Blogs Present</p>
            </div>
          )}
          {(blogs || []).length > 0 ? (
            <div className="flex justify-center mt-8 mb-5">
              {[...Array(pages)].map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 cursor-pointer 
            ${currentPage === index + 1 ? "bg-blue-500" : "bg-gray-300"}
          `}
                  onClick={() => handleClick(index + 1)}
                ></div>
              ))}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="w-1/4 md:mr-7 hidden md:block">
          <UserSideBar
            topics={topics || []}
            followers={followers || []}
            following={following || []}
          ></UserSideBar>
        </div>
      </div>
    </div>
  );
};
