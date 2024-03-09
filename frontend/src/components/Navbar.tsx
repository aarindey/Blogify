import { Link } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { MouseEventHandler } from "react";

export const Navbar = ({
  buttonText = "Write",
  onClick,
}: {
  buttonText?: string;
  onClick?: MouseEventHandler<Element>;
}) => {
  return (
    <nav className="fixed w-full bg-white border-b flex justify-between items-center px-10">
      <Link to={"/blogs"}>
        <div className="flex justify-center items-center w-10 h-10 m-2">
          <img src="../../public/vite.svg" className="rounded-xl"></img>
          <div className="text-xl font-bold cursor-pointer text-orange-500 m-1">
            Blogify
          </div>
        </div>
      </Link>

      <div className="flex">
        {" "}
        {buttonText == "Write" && (
          <Link to={"/create"}>
            <button
              type="button"
              className="mt-1 text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-400 font-medium rounded-full text-sm px-3 py-1.5 text-center me-2 mb-2"
            >
              {buttonText}
            </button>
          </Link>
        )}
        {buttonText != "Write" && (
          <button
            onClick={onClick}
            type="button"
            className="mt-1 text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-400 font-medium rounded-full text-sm px-3 py-1.5 text-center me-2 mb-2"
          >
            {buttonText}
          </button>
        )}
        <Avatar authorName="Arindam Dey" padding="p-5" />
      </div>
    </nav>
  );
};
