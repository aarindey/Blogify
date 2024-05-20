/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Navbar } from "../components/Navbar";
import { useBlogs } from "../hooks";
import { SideBar } from "../components/SideBar";
import SearchBox from "../components/SearchBox";
import axios from "axios";
import { BACKEND_URL } from "../config";
import ChatBox from "../components/ChatBox";

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
  const [fetchType, setFetchType] = useState("all");
  const [searchBlogs, setSearchBlogs] = useState([]);
  const [searchEnabled, setSearchEnabled] = useState(false);

  // Event handler to update the current page when the slider is moved
  const handleClick = (page: number) => {
    setCurrentPage(page);
  };

  const [queryString, setQueryString] = useState<string>("");

  const searchRequest = () => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/search?q=${queryString}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setSearchEnabled(true);
        console.log("Response:", response.data);
        setSearchBlogs(response.data.blogs);
        // Handle response data as needed
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });
  };

  const { loading, blogs, pages } = useBlogs({
    page: currentPage,
    limit: 5,
    fetchType,
  });

  useEffect(() => {
    document.title = "Blogify | Feed";
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col">
        <Navbar />
        <SearchBox
          value={queryString}
          setQueryString={setQueryString}
          searchRequest={searchRequest}
        />

        <div className="flex items-center justify-start space-x-4 mt-20 pl-7">
          <button
            className={`px-4 py-2 rounded-full border border-transparent transition-colors duration-300 focus:outline-none focus:border-blue-500 hover:bg-orange-500 hover:text-white ${
              fetchType === "followedUsers"
                ? "bg-blue-500 text-white"
                : "bg-orange-200"
            }`}
            onClick={() => {
              setFetchType("followedUsers");
              setCurrentPage(1);
            }}
          >
            Blogs from Followed Users
          </button>
          <button
            className={`px-4 py-2 rounded-full border border-transparent transition-colors duration-300 focus:outline-none focus:border-blue-500 hover:bg-orange-500 hover:text-white ${
              fetchType === "followedTopics"
                ? "bg-blue-500 text-white"
                : "bg-orange-200"
            }`}
            onClick={() => {
              setFetchType("followedTopics");
              setCurrentPage(1);
            }}
          >
            Blogs on Followed Topics
          </button>
          <button
            className={`px-4 py-2  rounded-full border border-transparent transition-colors duration-300 focus:outline-none focus:border-blue-500 hover:bg-orange-500 hover:text-white ${
              fetchType === "all" ? "bg-blue-500 text-white" : "bg-orange-200"
            }`}
            onClick={() => {
              setFetchType("all");
              setCurrentPage(1);
            }}
          >
            All Blogs
          </button>
        </div>
        <div className="flex mt-4 justify-center">
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
      <SearchBox
        value={queryString}
        setQueryString={setQueryString}
        searchRequest={searchRequest}
      />

      <div className="flex items-center justify-start space-x-4 mt-20 pl-7">
        <button
          className={`px-4 py-2 rounded-full border border-transparent transition-colors duration-300 focus:outline-none focus:border-blue-500 hover:bg-orange-500 hover:text-white ${
            fetchType === "followedUsers"
              ? "bg-blue-500 text-white"
              : "bg-orange-200"
          }`}
          onClick={() => {
            setSearchEnabled(false);
            setQueryString("");
            setFetchType("followedUsers");
            setCurrentPage(1);
          }}
        >
          Blogs from Followed Users
        </button>
        <button
          className={`px-4 py-2 rounded-full border border-transparent transition-colors duration-300 focus:outline-none focus:border-blue-500 hover:bg-orange-500 hover:text-white ${
            fetchType === "followedTopics"
              ? "bg-blue-500 text-white"
              : "bg-orange-200"
          }`}
          onClick={() => {
            setSearchEnabled(false);
            setQueryString("");
            setFetchType("followedTopics");
            setCurrentPage(1);
          }}
        >
          Blogs on Followed Topics
        </button>
        <button
          className={`px-4 py-2 rounded-full border border-transparent transition-colors duration-300 focus:outline-none focus:border-blue-500 hover:bg-orange-500 hover:text-white ${
            fetchType === "all" ? "bg-blue-500 text-white" : "bg-orange-200"
          }`}
          onClick={() => {
            setSearchEnabled(false);
            setQueryString("");
            setFetchType("all");
            setCurrentPage(1);
          }}
        >
          All Blogs
        </button>
      </div>
      {searchEnabled ? (
        <div className="flex mt-4 justify-center">
          <div className="w-full mx-4 md:m-0 md:w-3/4">
            {searchBlogs.length > 0 ? (
              searchBlogs.map((blog: Blog) => {
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
              <div className="flex justify-center items-center h-2/3 mt-10 font-extralight text-xl">
                {" "}
                <p>No Blogs Present</p>
              </div>
            )}
            {/* <div className="flex justify-center mt-8">
              {[...Array(pages)].map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 cursor-pointer 
            ${currentPage === index + 1 ? "bg-blue-500" : "bg-gray-300"}
          `}
                  onClick={() => handleClick(index + 1)}
                ></div>
              ))}
            </div> */}
          </div>
          <div className="w-1/4 md:mr-7 hidden md:block">
            <SideBar type={"general"} />
          </div>
        </div>
      ) : (
        <div className="flex mt-4 justify-center">
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
              <div className="flex justify-center items-center h-2/3 mt-10 font-extralight text-xl">
                {" "}
                <p>No Blogs Present</p>
              </div>
            )}
            <div className="flex justify-center mt-8">
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
          </div>
          <div className="w-1/4 md:mr-7 hidden md:block">
            <SideBar type={"general"} />
          </div>
        </div>
      )}
      <ChatBox title={""} content={""} global={true}></ChatBox>
    </div>
  );
};
