import { Link, useNavigate } from "react-router-dom";
import { AuthorHeader } from "./AuthorHeader";
import { Bubble } from "./Bubble";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: {
    id?: number;
    bio: string;
    name: string;
  };
  topics?: {
    id?: number;
    name?: string;
  }[];
}

export const IndividualBlog = ({
  blog,
  imageUrl,
  imageName,
}: {
  blog: Blog;
  imageUrl: string;
  imageName: string;
}) => {
  const navigate = useNavigate();
  async function handleDelete() {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/delete/${blog.id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (imageName != null && imageName != "") {
        await axios.delete(
          `http://127.0.0.1:3001/api/v1/deleteImg?imageName=${imageName}`
        );
      }

      navigate("/blogs");
    } catch (error) {
      console.error("Error deleting blog or image:", error);
    }
  }

  return (
    <div className="flex px-10 pt-12">
      <div className="flex flex-col w-full lg:w-3/4 justify-center px-4 py-6 m-4">
        <div className="text-5xl font-extrabold">{blog.title}</div>
        <div className="flex pt-4">
          <Link to={`/update/${blog.id}`} state={{ blog }}>
            <button
              type="button"
              className="mt-1 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-3 py-1.5 text-center me-2 mb-2"
            >
              Edit
            </button>{" "}
          </Link>
          <button
            onClick={handleDelete}
            type="button"
            className="mt-1 text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-3 py-1.5 text-center me-2 mb-2"
          >
            Delete
          </button>
        </div>
        <div className="text-slate-500 pt-4">Posted on 2nd Dec, 2020</div>
        <div className="pt-4">{blog.content}</div>
        {imageUrl != "" && imageUrl != null && (
          <img
            className="mt-5"
            id={String(blog.id)}
            src={imageUrl}
            alt="Dynamic Image"
          ></img>
        )}
      </div>
      <div className="w-1/4 mt-10 hidden lg:block">
        <div className="flex flex-col justify-center">
          {" "}
          <div className="text-slate-600 text-lg ml-6">Author</div>
          <div>
            <div>
              <AuthorHeader
                id={blog.author.id || 0}
                name={blog.author.name}
                bio={blog.author.bio}
              ></AuthorHeader>
            </div>
          </div>
          <div className="text-slate-600 text-lg ml-6">Topics</div>
          <div className="flex flex-wrap px-3 py-3 bg-slate-100 rounded-lg">
            {blog?.topics?.map((topic) => (
              <Bubble name={topic.name || ""} id={topic.id || 1}></Bubble>
            ))}
            {blog?.topics?.length === 0 && (
              <div className="p-4">No Topics to Display</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
