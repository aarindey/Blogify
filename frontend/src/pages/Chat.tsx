import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { ChatHeader } from "../components/ChatHeader";
import SearchBox from "../components/SearchBox";
import { Avatar } from "../components/BlogCard";
import { TextBox } from "../components/TextBox";
import ChatInputBox from "../components/ChatInputBox";

interface Participant {
  _id: string;
  username: string;
  name: string;
}

interface LastMessage {
  text: string;
  sender: string;
}

interface Conversation {
  lastMessage: LastMessage;
  _id: string;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Pikachu5@gmail.com");
  const [password, setPassword] = useState("pikachu5");
  useEffect(() => {
    document.title = "Blogify | Chat";
  });

  useEffect(() => {
    const getConversations = async () => {
      try {
        await axios.post(
          "http://127.0.0.1:3003/api/v1/user/signin",
          {
            username: username,
            password: password,
          },
          { withCredentials: true }
        );
        const res = await axios.get(
          "http://127.0.0.1:3003/api/v1/message/conversations",
          { withCredentials: true }
        );
        setConversations(res.data.conversations);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, []);
  if (loading) {
    return <div>Loading..</div>;
  }
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex justify-center">
        <div className="w-[70rem] flex -mt-3">
          <div className="w-4/12 p-2">
            <div className="mt-20 px-4 py-2 rounded-full border border-transparent bg-orange-500 text-white">
              Your Conversations
            </div>
            <SearchBox />
            <div className="h-[32rem] overflow-scroll">
              {conversations.map((conversation) => {
                return (
                  <ChatHeader
                    id={conversation._id}
                    name={conversation.participants[0].name}
                    lastMessage={conversation.lastMessage.text}
                  />
                );
              })}
            </div>
          </div>
          <div className="w-8/12 p-2">
            <div className="flex flex-col px-1">
              <div className="mt-20 px-4 py-2 rounded-full border border-transparent transition-colors duration-300 focus:outline-none focus:border-blue-500">
                Message Box
              </div>
              <div className="bg-gray-200 rounded-lg">
                <div className="p-3 flex">
                  <Avatar padding="p-4" />
                  <div className="flex items-center px-3">Name here</div>
                </div>
                <div className="bg-slate-300 pt-0.5"></div>
                <div className="h-[29rem] overflow-scroll flex flex-col">
                  <TextBox message="Hey, Let's catch up" isSender={false} />
                  <TextBox message="Yes, Sure when" isSender={true} />
                  <TextBox message="You say when" isSender={false} />
                  <TextBox message="Umm let me think" isSender={true} />
                  <TextBox message="Sure, let me know" isSender={false} />
                  <TextBox message="Hey, Let's catch up" isSender={false} />
                  <TextBox message="Yes, Sure when" isSender={true} />
                  <TextBox message="You say when" isSender={false} />
                  <TextBox message="Umm let me think" isSender={true} />
                  <TextBox message="Sure, let me know" isSender={false} />
                  <TextBox message="Hey, Let's catch up" isSender={false} />
                  <TextBox message="Yes, Sure when" isSender={true} />
                  <TextBox
                    message="I started reading Sapiens by Yuval Noah Harari. It's really fascinating, delving into the history of humanity."
                    isSender={false}
                  />
                  <TextBox
                    message="I started reading Sapiens by Yuval Noah Harari. It's really fascinating, delving into the history of humanity."
                    isSender={true}
                  />
                  <TextBox message="Sure, let me know" isSender={false} />
                </div>
                <ChatInputBox></ChatInputBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
