import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { AuthorHeader } from "./AuthorHeader";
import axios from "axios";
import { Spinner } from "./Spinner";

interface Author {
  id: number;
  name: string;
  bio: string;
}

export const EliteAuthors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function sendRequest() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/author/elite`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setAuthors(response.data.users);
        setLoading(false);
      } catch (error) {
        console.log("Error while bulk topic request ", error);
      }
    }
    sendRequest();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-10 items-center w-40">
        <Spinner />
      </div>
    );
  }
  return (
    <div>
      {authors.map((author) => (
        <AuthorHeader
          id={author.id}
          name={author.name}
          bio={author.bio}
        ></AuthorHeader>
      ))}
      {authors.length === 0 && <div className="p-3">No Users Registered</div>}
    </div>
  );
};
