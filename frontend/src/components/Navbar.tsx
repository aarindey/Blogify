import { Link } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { MouseEventHandler, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface User {
  id: number;
  name: string;
}

export const Navbar = ({
  buttonText = "Write",
  onClick,
}: {
  buttonText?: string;
  onClick?: MouseEventHandler<Element>;
}) => {
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
        });
    } catch (error) {
      console.log("some error occured");
    }
  }, []);
  return (
    <nav className="fixed w-full bg-white border-b flex justify-between items-center px-10">
      <Link to={"/blogs"}>
        <div className="flex justify-center items-center w-10 h-10 m-2">
          <img src="../../vite.svg" className="rounded-xl" alt="logo"></img>
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
        <Link to={`/user/${user?.id}`}>
          <Avatar authorName={user?.name} padding="p-5" />
        </Link>
      </div>
    </nav>
  );
};
