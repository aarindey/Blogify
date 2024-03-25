import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, IMAGE_SERVICE_URL } from "../config";

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

export const useBlogs = ({
  page = 1,
  limit = 5,
  fetchType = "All",
}: {
  page: number;
  limit: number;
  fetchType: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pages, setPages] = useState<number>();

  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/blog/fetch?page=${page}&limit=${limit}&type=${fetchType}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setBlogs(response.data.data);
        setPages(response.data.totalPages);
        setLoading(false);
      });
  }, [limit, page, fetchType]);

  return { loading, blogs, pages };
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
            `${IMAGE_SERVICE_URL}/api/v1/blogImg?imageName=${name}`
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

export const useAuthorBlogs = ({
  id,
  page,
  limit,
}: {
  id: string;
  page: number;
  limit: number;
}) => {
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pages, setPages] = useState<number>();

  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/author/${id}/blogs?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setBlogs(response.data.blogs);
        setPages(response.data.totalPages);
        setBlogsLoading(false);
      });
  }, [id, limit, page]);

  return { blogsLoading, setBlogsLoading, blogs, pages };
};
