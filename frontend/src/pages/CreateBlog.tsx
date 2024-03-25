import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { BACKEND_URL, IMAGE_SERVICE_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState<string[]>([""]);
  const [error, setError] = useState<string>("");
  const [file, setFile] = useState<File | undefined>();
  const [imageName, setImageName] = useState("");
  const navigate = useNavigate();

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

  const handleInputChange = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const handleAddInput = () => {
    setTopics([...topics, ""]); // Add a new empty input field
  };

  const handleRemoveInput = (index: number) => {
    const newTopics = [...topics];
    newTopics.splice(index, 1);
    setTopics(newTopics);
  };

  const imageSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const fileName = generateFileName(32);

    const formData = new FormData();
    formData.append("image", file as File);

    await axios.post(
      `${IMAGE_SERVICE_URL}/api/v1/imgUpload?imageName=${fileName}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    setImageName(fileName);
  };

  useEffect(() => {
    document.title = "Blogify | Publish Blog";
  }, []);

  function PublishBlog() {
    // Check if any topic is empty
    if (topics.some((topic) => topic === "")) {
      setError("Please provide a name for all topics");
      return; // Stop publishing the blog if any topic is empty
    }

    axios
      .post(
        `${BACKEND_URL}/api/v1/blog`,
        {
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
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-md focus:ring-blue-500 focus:border-blue-500"
          />
          <label className="mt-4 block mb-2 text-sm font-medium text-gray-900">
            Content
          </label>
          <textarea
            onChange={(e) => {
              setContent(e.target.value);
            }}
            placeholder="Describe the events :)"
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
            {topics.map((topic, index) => (
              <div key={index} className="mb-2 flex">
                <input
                  placeholder="Add Topics/Tags"
                  value={topic}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  type="text"
                  id={`small-input-${index}`}
                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => handleRemoveInput(index)}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Remove
                </button>
              </div>
            ))}
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
