import { memo, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { AuthorHeader } from "./AuthorHeader";
import axios from "axios";
import { Bubble } from "./Bubble";
import { EliteAuthors } from "./EliteAuthors";
import { Spinner } from "./Spinner";

interface Topic {
  id: number;
  name: string;
}
interface User {
  id: number;
  name: string;
  bio: string;
}

export const SideBar = memo(
  ({ users, type = "general" }: { users?: User[]; type?: string }) => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function sendRequest() {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/v1/topic/bulk`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          });
          setTopics(response.data.data);
          setLoading(false);
        } catch (error) {
          console.log("Error while bulk topic request ", error);
        }
      }
      sendRequest();
    }, []); // Empty dependency array to run the effect only once

    if (loading) {
      return (
        <div>
          {" "}
          <div>
            <div>Recommended Topics</div>
            <div className="flex justify-center p-10 items-center w-40">
              <Spinner />
            </div>
          </div>
          <div>
            {" "}
            {type === "general" ? (
              <div className="mt-2 mb-1">Recommended People</div>
            ) : (
              <div className="mt-2 mb-1">People following this Topic</div>
            )}
            <div className="flex justify-center p-10 items-center w-40">
              <Spinner />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div>Recommended Topics</div>
        <div className="flex flex-wrap px-3 py-3 bg-slate-100 rounded-lg">
          {topics.map((topic) => (
            <Bubble name={topic.name} id={topic.id}></Bubble>
          ))}
        </div>
        {type === "general" ? (
          <div className="mt-2 mb-1">Recommended People</div>
        ) : (
          <div className="mt-2 mb-1">People following this Topic</div>
        )}
        {type !== "general" && (
          <div>
            {users?.map((user) => (
              <AuthorHeader
                id={user.id}
                name={user.name}
                bio={user.bio}
              ></AuthorHeader>
            ))}
            {users?.length == 0 && <div className="p-3">No Followers</div>}
          </div>
        )}
        {type === "general" && <EliteAuthors></EliteAuthors>}
      </div>
    );
  }
);
