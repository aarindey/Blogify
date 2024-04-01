import { SetStateAction, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import ChatHeader from "../components/ChatHeader";
import SearchBox from "../components/SearchBox";
import { Avatar } from "../components/BlogCard";
import { TextBox } from "../components/TextBox";
import ChatInputBox from "../components/ChatInputBox";
import { useRecoilState } from "recoil";
import { conversationsAtom, messagesAtom } from "../atoms/messagesAtom";
import ChatPageSkeleton from "../components/ChatPageSkeleton";
import { CHAT_SERVICE_URL } from "../config";

interface Participant {
  _id: string;
  username: string;
  name: string;
}

interface LastMessage {
  text: string;
  sender: { _id: string; name: string };
}

interface Conversation {
  lastMessage: LastMessage;
  _id: string;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  username: string;
  name: string;
}

export const Chat = () => {
  const [conversations, setConversations] =
    useRecoilState<Conversation[]>(conversationsAtom);
  const [otherUser, setOtherUser] = useState<User>();
  const [user, setUser] = useState<User>();
  const [messages, setMessages] = useRecoilState<Message[]>(messagesAtom);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    document.title = "Blogify | Chat";
  });

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `${CHAT_SERVICE_URL}/api/v1/message/conversations`,
          { withCredentials: true }
        );
        setConversations(res.data.conversations);
        const response = await axios.get(`${CHAT_SERVICE_URL}/api/v1/user/me`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };
    getConversations();
  }, [setConversations]);

  useEffect(() => {
    const getMessages = async (userId: string) => {
      try {
        const res = await axios.get(
          `${CHAT_SERVICE_URL}/api/v1/message/${userId}`,
          { withCredentials: true }
        );
        setMessages(res.data.messages);
      } catch (error) {
        alert(error);
      }
    };
    const userId = otherUser?._id;
    if (otherUser && userId !== undefined) {
      getMessages(userId);
    }
  }, [otherUser, setMessages]);

  function handleClick(user: User) {
    setOtherUser(user);
  }

  function handleMessageSubmit() {
    async function messagePost() {
      try {
        await axios.post(
          `${CHAT_SERVICE_URL}/api/v1/message/send`,
          { recipientId: otherUser?._id, message: message },
          { withCredentials: true }
        );
      } catch (error) {
        alert(error);
      }
    }
    messagePost();
  }

  if (loading) {
    return <ChatPageSkeleton />;
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
                    onClick={() => handleClick(conversation.participants[0])}
                    name={conversation.participants[0].name}
                    lastMessage={conversation.lastMessage.text}
                    sender={conversation.lastMessage.sender.name}
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
                {otherUser === undefined ? (
                  <div className="w-full h-[36rem] flex justify-center items-center">
                    {" "}
                    <div className="-mt-16 font-extralight text-xl">
                      Select Conversation to view messages
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-3 flex">
                      <Avatar padding="p-4" />
                      <div className="flex items-center px-3">{user?.name}</div>
                    </div>
                    <div className="bg-slate-300 pt-0.5"></div>
                    <div className="h-[29rem] overflow-scroll flex flex-col">
                      {messages.map((message) => (
                        <TextBox
                          message={message.text}
                          isSender={
                            message.sender === otherUser?._id ? false : true
                          }
                        />
                      ))}
                    </div>
                    <ChatInputBox
                      onChange={(e: {
                        target: { value: SetStateAction<string> };
                      }) => {
                        return setMessage(e.target.value);
                      }}
                      onClick={handleMessageSubmit}
                    ></ChatInputBox>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
