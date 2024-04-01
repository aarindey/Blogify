const ChatHeaderSkeleton = () => {
  return (
    <div className="flex justify-center items-start gap-2.5 bg-slate-200 animate-pulse rounded-lg px-2 py-2 my-1 mr-1">
      <div className="h-2 bg-gray-200 rounded-full mb-2.5">
        {" "}
        <svg
          className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
      </div>
      <div className="flex flex-col w-full leading-1.5">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900"></span>
        </div>
        <p className="text-sm font-normal py-2 my-1 text-gray-900">
          {" "}
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
          <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </p>
      </div>
    </div>
  );
};

export default ChatHeaderSkeleton;
