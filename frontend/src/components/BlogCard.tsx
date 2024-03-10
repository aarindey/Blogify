import { Link } from "react-router-dom";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishedDate,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="border-b border-slate-300 p-4 cursor-pointer bg-slate-200 rounded-lg md:mx-7 my-2">
        <div className="flex">
          <div className="flex justify-center flex-col">
            <Avatar authorName={authorName}></Avatar>
          </div>
          <div className="flex justify-center flex-col font-medium pl-2">
            {authorName}
          </div>
          <div className="flex justify-center flex-col pl-2">
            <Circle />
          </div>
          <div className="flex justify-center flex-col pl-2 font-thin text-slate-500">
            {publishedDate}
          </div>
        </div>
        <div className="text-xl font-bold">{title}</div>
        <div className="text-md">{content.slice(0, 100) + "..."}</div>
        <div className="text-slate-500 text-sm font-thin">{`${Math.ceil(
          content.length / 100
        )} minute(s) read`}</div>
      </div>
    </Link>
  );
};

export function Avatar({
  authorName = "Anonymous",
  padding,
}: {
  authorName?: string;
  padding?: string;
}) {
  const name = authorName.split(" ");
  const initials = name.length > 1 ? name[0][0] + "." + name[1][0] : name[0][0];
  return (
    <div
      className={`${padding} inline-flex items-center justify-center w-6 h-6 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}
    >
      <span className="text-xs text-gray-600 dark:text-gray-300">
        {initials.toUpperCase()}
      </span>
    </div>
  );
}

export function Circle() {
  return (
    <div className="rounded-full bg-gray-500 border-gray-500 border-2 flex p-[0.1rem]"></div>
  );
}
