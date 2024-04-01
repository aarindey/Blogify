import { ChangeEvent, MouseEventHandler } from "react";

interface ChatInputBoxProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const ChatInputBox = ({ onChange, onClick }: ChatInputBoxProps) => {
  return (
    <div className="flex">
      <div className="w-full m-2 bg-white border border-gray-300 rounded-lg  relative">
        <input
          onChange={onChange}
          type="text"
          className="w-full bg-white border-none rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          onClick={onClick}
          className="absolute right-0 bottom-0 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center transform translate-x-1/2 translate-y-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M17.708 2.293a1 1 0 0 1 0 1.414L5.414 16.707a1 1 0 0 1-1.414-1.414L16.293 2.293a1 1 0 0 1 1.415 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInputBox;
