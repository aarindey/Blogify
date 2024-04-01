import { Avatar } from "./BlogCard";

interface ChatHeaderProps {
  onClick: (arg0: string) => void;
  name: string;
  lastMessage: string;
  sender: string;
}

const ChatHeader = ({
  onClick,
  name = "Anonymous",
  lastMessage,
  sender,
}: ChatHeaderProps) => {
  return (
    <div
      onClick={() => onClick(sender)}
      className="flex justify-center items-start cursor-pointer gap-2.5 bg-slate-200 rounded-lg px-2 py-2 my-1 mr-1"
    >
      <Avatar authorName={name} padding="p-4" />
      <div className="flex flex-col w-full leading-1.5">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900">{name}</span>
        </div>
        <p className="text-sm font-normal py-2 text-gray-900">
          {sender}:{" "}
          {name.length + lastMessage.length > 42
            ? lastMessage.substring(0, 36 - name.length) + "..."
            : lastMessage}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
