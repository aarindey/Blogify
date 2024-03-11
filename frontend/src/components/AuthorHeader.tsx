import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";

export const AuthorHeader = ({
  id,
  name,
  bio,
}: {
  id: number;
  name: string;
  bio: string;
}) => {
  return (
    <Link to={`/user/${id}`}>
      <div className="flex justify-center items-start gap-2.5 bg-slate-100 rounded-lg px-2 py-2 my-1">
        <Avatar authorName={name} padding="p-4" />
        <div className="flex flex-col w-full leading-1.5">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span className="text-sm font-semibold text-gray-900">{name}</span>
          </div>
          <p className="text-sm font-normal py-2 text-gray-900">{bio}</p>
        </div>
      </div>
    </Link>
  );
};
