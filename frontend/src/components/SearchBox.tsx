// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const SearchBox = ({ setQueryString, searchRequest, value }) => {
  return (
    <div className="flex items-center max-w-full justify-start mt-16 mx-8 -mb-16">
      <div className="relative">
        <input
          type="text"
          value={value}
          className="border w-[10rem] md:w-[12rem] lg:w-[15rem] border-gray-300 rounded-md py-2 px-2 focus:outline-none focus:border-blue-500"
          placeholder="Search Box"
          onChange={(e) => {
            setQueryString(e.target.value);
          }}
        />
        <button
          onClick={searchRequest}
          className="font-bold py-2 px-4 border-slate-500"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-5.2-5.2m-.8-.8a8 8 0 1 1-11.3-11.3 8 8 0 0 1 11.3 11.3z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
