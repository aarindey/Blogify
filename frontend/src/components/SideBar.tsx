import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { AuthorHeader } from "./AuthorHeader";
import axios from "axios";
import { Bubble } from "./Bubble";

interface Topic {
  id: number;
  name: string;
}

export const SideBar = () => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    async function sendRequest() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/topic/bulk`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setTopics(response.data.data);
      } catch (error) {
        console.log("Error while bulk topic request ", error);
      }
    }
    sendRequest();
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <div>Recommended Topics</div>
      <div className="flex flex-wrap gap-1 max-w-[18rem] px-2 py-3 bg-slate-100 rounded-lg">
        {topics.map((topic) => (
          <Bubble name={topic.name} id={topic.id}></Bubble>
        ))}
      </div>
      <div className="mt-2 mb-1">Recommended People</div>
      <div>
        <AuthorHeader
          name="Aarin Dey"
          description="he is guy who loves coding and stuffs"
        />
        <AuthorHeader name="Miyoko" description="Make up is my thing" />
        <AuthorHeader name="Sukuza" description="Animation and space" />
        <AuthorHeader name="Raj Verma" description="Systems" />
        <AuthorHeader name="Kabir Singh" description="Coding and Fun" />
      </div>
    </div>
  );
};
