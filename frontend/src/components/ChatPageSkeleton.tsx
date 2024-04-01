import { Navbar } from "./Navbar";
import ChatHeaderSkeleton from "./ChatHeaderSkeleton";
import { Avatar } from "./BlogCard";
import MessagesSkeleton from "./MessagesSkeleton";
import ChatInputBox from "./ChatInputBox";
import SearchBox from "./SearchBox";

const ChatPageSkeleton = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex justify-center">
        <div className="w-[70rem] flex -mt-3">
          <div className="w-4/12 p-2">
            <div className="mt-20 px-4 py-2 rounded-full border border-transparent bg-orange-500 text-white">
              Your Conversations
            </div>
            <SearchBox/>
            <div className="h-[32rem] overflow-scroll">
              <ChatHeaderSkeleton />
              <ChatHeaderSkeleton />
              <ChatHeaderSkeleton />
              <ChatHeaderSkeleton />
              <ChatHeaderSkeleton />
              <ChatHeaderSkeleton />
              <ChatHeaderSkeleton />
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
                  <MessagesSkeleton />
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

export default ChatPageSkeleton;
