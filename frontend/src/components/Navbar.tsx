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
    <nav className="fixed w-full bg-white border-b flex justify-between items-center px-10 py-2">
      <Link to={"/blogs"}>
        <div className="text-xl font-bold cursor-pointer">Medium</div>
      </Link>

      <div className="flex">
        {" "}
        {buttonText == "Write" && (
          <Link to={"/create"}>
            <button
              type="button"
              className="mt-1 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-700 font-medium rounded-full text-sm px-3 py-1.5 text-center me-2 mb-2"
            >
              {buttonText}
            </button>
          </Link>
        )}
        {buttonText != "Write" && (
          <button
            onClick={onClick}
            type="button"
            className="mt-1 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-700 font-medium rounded-full text-sm px-3 py-1.5 text-center me-2 mb-2"
          >
            {buttonText}
          </button>
        )}
        <Avatar authorName="Arindam Dey" padding="p-5" />
      </div>
    </nav>
  );
};
