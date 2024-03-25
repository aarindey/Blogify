import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { BACKEND_URL, IMAGE_SERVICE_URL } from "../config";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export const UpdateBlog = () => {
  const location = useLocation();
  const { blog } = location.state;
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [topics, setTopics] = useState(blog.topics);
  const [file, setFile] = useState<File | undefined>();
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const blogId = Number(id);

  const handleInputChange = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index].name = value;
    setTopics(newTopics);
  };

  const handleAddInput = () => {
    const randomId = generateRandomId();
    setTopics([...topics, { id: randomId, name: "" }]);
  };

  const handleRemoveInput = (index: number) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  // Function to generate a random ID
  const generateRandomId = () => {
    return Math.floor(Math.random() * 9007199254740991) + 1; // Max safe integer in JavaScript
  };

  useEffect(() => {
    document.title = "Blogify | Update Blog";
  }, []);

  function RepublishBlog() {
    // Check if any topic has an empty name
    if (
      topics.some((topic: { id: number; name: string }) => {
        return topic.name === "";
      })
    ) {
      setError("Please provide a name for all topics");
      return; // Stop publishing the blog if any topic is empty
    }

    axios
      .put(
        `${BACKEND_URL}/api/v1/blog/update`,
        {
          id: blogId,
          title: title,
          content: content,
          topics: topics,
          imageName: imageName,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        navigate(`/blog/${response?.data?.data?.id}`);
      });
  }

  function generateFileName(length: number): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const timestampPart = Date.now().toString(36); // Convert timestamp to base36 string
      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      result += timestampPart.slice(-1) + randomChar; // Append last character of timestamp and a random character
    }

    return result.slice(0, length); // Trim the result to desired length
  }

  const imageSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    let fileName = blog.imageName;
    setImageName(fileName);

    const formData = new FormData();
    formData.append("image", file as File);

    if (fileName === "" || fileName === null) {
      fileName = generateFileName(32);
      setImageName(fileName);
    }

    if (fileName != null && fileName !== "") {
      await axios.post(
        `${IMAGE_SERVICE_URL}/api/v1/imgUpload?imageName=${fileName}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    }
  };

  return (
    <div>
      <Navbar buttonText="Re-Publish" onClick={RepublishBlog} />
      <div className="flex flex-col justify-center items-center ">
        <div className="flex flex-col py-4 max-w-xl w-full">
          <label className="mt-20 block mb-2 text-sm font-medium text-gray-900">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="small-input"
            className="block w-full p-2 text-gray-900 border text-md border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500"
          />
          <label className="mt-4 block mb-2 text-sm font-medium text-gray-900">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            id="large-input"
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 h-[20rem]"
          ></textarea>
          <form className="mt-4" onSubmit={imageSubmit}>
            <input
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  const selectedFile = files[0] as File;
                  setFile(selectedFile);
                }
              }}
              type="file"
              accept="image/*"
            ></input>
            <button
              className="ml-2 bg-green-500 text-white px-4 py-1 rounded-lg"
              type="submit"
            >
              Submit Image
            </button>
          </form>
          <label className="mt-4 block mb-2 text-sm font-medium text-gray-900">
            Topics ( Add one topic in each input box )
          </label>
          <div>
            {topics.map(
              (topic: { name: string; id: number }, index: number) => (
                <div key={index} className="mb-2">
                  <input
                    value={topic.name}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    type="text"
                    id={`small-input-${index}`}
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleRemoveInput(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
            <button
              onClick={handleAddInput}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Another Topic
            </button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
};
