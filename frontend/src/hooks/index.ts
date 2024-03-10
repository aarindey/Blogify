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

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlog(response.data.data);
        setLoading(false);
      });
  }, [id]);

  return { loading, blog };
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
