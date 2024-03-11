import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { AuthorHeader } from "./AuthorHeader";
import axios from "axios";

interface Author {
  id: number;
  name: string;
  bio: string;
}

export const EliteAuthors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    async function sendRequest() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/author/elite`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setAuthors(response.data.users);
      } catch (error) {
        console.log("Error while bulk topic request ", error);
      }
    }
    sendRequest();
  }, []);
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
