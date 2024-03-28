import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { ChatHeader } from "../components/ChatHeader";
import SearchBox from "../components/SearchBox";
import { Avatar } from "../components/BlogCard";
import { TextBox } from "../components/TextBox";
import ChatInputBox from "../components/ChatInputBox";

interface User {
  id: number;
  name: string;
}

export const Chat = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    try {
      axios
        .get(`${BACKEND_URL}/api/v1/author/me`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setUser(response.data.user);
          setLoading(false);
        });
    } catch (error) {
      console.log("some error occured");
    }
  }, []);
  useEffect(() => {
    document.title = "Blogify | Chat";
  });

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
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey this is Aarin"
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey this is Aarin I want to make sure if you have received the mail"
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey This is the last message to this conversation."
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey This is the last message to this conversation."
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey This is the last message to this conversation."
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey this is Aarin"
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey this is Aarin I want to make sure if you have received the mail"
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey This is the last message to this conversation."
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey This is the last message to this conversation."
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey This is the last message to this conversation."
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey this is Aarin"
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey this is Aarin I want to make sure if you have received the mail"
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey This is the last message to this conversation."
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey This is the last message to this conversation."
              />
              <ChatHeader
                id={1}
                name="Arindam Dey"
                lastMessage="Hey This is the last message to this conversation."
              />
            </div>
          </div>
          <div className="w-8/12 p-2">
            <div className="flex flex-col px-1">
              <div className="mt-20 px-4 py-2 rounded-full border border-transparent transition-colors duration-300 focus:outline-none focus:border-blue-500">
                Message Box
              </div>
              <div className="bg-slate-100 rounded-lg">
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
