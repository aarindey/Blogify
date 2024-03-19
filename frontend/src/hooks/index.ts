import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface Blog {
  id: number;
  title: string;
  content: string;
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

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.data);
        setLoading(false);
      });
  }, []);

  return { loading, blogs };
};

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blogResponse = await axios.get(
          `${BACKEND_URL}/api/v1/blog/${id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const fetchedBlog = blogResponse.data.data;
        setBlog(fetchedBlog);
        const name = fetchedBlog.imageName;
        setImageName(name);
        if (name != null && name != "") {
          const imageResponse = await axios.get(
            `http://127.0.0.1:3001/api/v1/blogImg?imageName=${name}`
          );

          setImageUrl(imageResponse.data.imageUrl);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  return { loading, blog, imageUrl, imageName };
};

interface Topic {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  bio: string;
}

export const useTopic = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState<Topic>();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/topic/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setTopic(response.data.topic);
        setBlogs(response.data.blogs);
        setUsers(response.data.users);
        setLoading(false);
      });
  }, [id]);

  return { loading, topic, blogs, users };
};

interface Author {
  id: number;
  name: string;
  bio: string;
  blogs: { id: number; title: string; content: string }[];
  following: { id: number; name: string; bio: string }[];
  followers: { id: number; name: string; bio: string }[];
  topics: { id: number; name: string }[];
}

export const useAuthor = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<Author>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/author/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setAuthor(response.data.author);
        setLoading(false);
      });
  }, [id]);

  return { loading, author };
};
