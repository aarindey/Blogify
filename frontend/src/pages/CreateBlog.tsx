import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState<string[]>([""]);
  const navigate = useNavigate();

  const handleInputChange = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleAddInput = () => {
    setTopics([...topics, ""]); // Add a new empty input field
  };

  useEffect(() => {
    document.title = "Blogify | Publish Blog";
  }, []);

  function PublishBlog() {
    axios
      .post(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title: title,
          content: content,
          topics: topics,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        navigate(`/blog/${response?.data?.id}`);
      });
  }

  return (
    <div>
      <Navbar buttonText="Publish" onClick={PublishBlog} />
      <div className="flex flex-col justify-center items-center ">
        <div className="flex flex-col py-4 max-w-xl w-full">
          <label className="mt-20 block mb-2 text-sm font-medium text-gray-900">
            Title
          </label>
          <input
            placeholder="What's the Topic?"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            id="small-input"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
          />
          <label className="mt-4 block mb-2 text-sm font-medium text-gray-900">
            Content
          </label>
          <input
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder="Describe the events :)"
            type="text"
            id="large-input"
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 h-[20rem]"
          />
          <label className="mt-4 block mb-2 text-sm font-medium text-gray-900">
            Topics ( Add one topic in each input box )
          </label>
          <div>
            {topics.map((topic, index) => (
              <div key={index} className="mb-2">
                <input
                  placeholder="Add Topics/Tags"
                  value={topic}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  type="text"
                  id={`small-input-${index}`}
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
            <button
              onClick={handleAddInput}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Another Topic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
