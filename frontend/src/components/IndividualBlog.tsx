import { Link, useNavigate } from "react-router-dom";
import { AuthorHeader } from "./AuthorHeader";
import { Bubble } from "./Bubble";
import { BACKEND_URL, IMAGE_SERVICE_URL } from "../config";
import axios from "axios";
import { useState, useEffect } from "react";
import { Spinner } from "./Spinner";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";

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

interface Comment {
  id: number;
  content: string;
  parentId: number | null;
  parent?: unknown;
  blogId?: number;
  author: {
    id: number;
    name: string;
  };
  replies?: Comment[] | null;
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
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(true);
  const [commentUnderEdit, setCommentUnderEdit] = useState<number>();
  const [commentEditMode, setCommentEditMode] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/${blog.id}/comments`,
          {
            headers: { Authorization: localStorage.getItem("token") },
          }
        );
        setComments(response.data.data);
        setCommentLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [blog.id]);

  async function handleDelete() {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/delete/${blog.id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (imageName != null && imageName != "") {
        await axios.delete(
          `${IMAGE_SERVICE_URL}/api/v1/deleteImg?imageName=${imageName}`
        );
      }

      navigate("/blogs");
    } catch (error) {
      console.error("Error deleting blog or image:", error);
    }
  }

  async function handleComment() {
    try {
      const requestData = {
        content: comment,
        blogId: blog.id,
      };

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog/${blog.id}/comments`,
        requestData,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      // If the comment was successfully added, update the local state with the new comment
      setComments([...comments, response.data.data]);

      // Clear the comment input field after posting
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }

  async function handleDeleteComment({ commentId }: { commentId: number }) {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/v1/blog/${blog.id}/comments/${commentId}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      // Filter out the comment with the specified ID
      const updatedComments = comments.filter(
        (comment) => comment.id !== commentId
      );

      // Update the state with the filtered comments
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting a comment:", error);
    }
  }

  async function handleUpdateComment() {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/blog/${blog.id}/comments/${commentUnderEdit}`,
        { content: comment },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      // Filter out the comment with the specified ID
      const updatedComments = comments.map((c) =>
        c.id === Number(commentUnderEdit) ? response.data.data : c
      );

      // Update the state with the filtered comments
      setComments(updatedComments);
      setCommentEditMode(false);
      setComment("");
    } catch (error) {
      console.error("Error deleting a comment:", error);
    }
  }

  function handleEditClick({
    commentId,
    content,
  }: {
    commentId: number;
    content: string;
  }) {
    setComment(content);
    setCommentEditMode(!commentEditMode);
    setCommentUnderEdit(commentId);
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
          <div>
            <p className="font-bold mt-10 mb-2 text-xl">Comments</p>
            <input
              type="text"
              id="company"
              value={comment}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Write your comment here.."
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
            <button
              onClick={handleComment}
              type="submit"
              className="text-white mt-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Submit
            </button>
            <div>
              {commentLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spinner size={7} />
                </div>
              ) : (
                <div className="mt-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="mt-4">
                      <div>
                        <span className="font-semibold">
                          {comment.author.name}
                        </span>{" "}
                        - {comment.content}
                        <button
                          onClick={() =>
                            handleDeleteComment({
                              commentId: comment.id,
                            })
                          }
                          className="bg-white hover:text-red-500 text-red-400 font-bold px-2 py-2 rounded inline-flex items-center"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        {commentEditMode && comment.id === commentUnderEdit ? (
                          <button
                            onClick={handleUpdateComment}
                            className="bg-white hover:text-blue-700 text-blue-500 font-bold py-2 rounded inline-flex items-center"
                          >
                            <PencilIcon className="h-5 w-5" /> Save Edit
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleEditClick({
                                commentId: comment.id,
                                content: comment.content,
                              })
                            }
                            className="bg-white hover:text-blue-700 text-blue-500 font-bold py-2 rounded inline-flex items-center"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
