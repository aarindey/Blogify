import { Link } from "react-router-dom";

export const Bubble = ({ name, id }: { name: string; id: number }) => {
  return (
    <Link to={`/topic/${id}`}>
      <div className="w-fit cursor-pointer text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-400 font-medium rounded-full text-sm px-3 py-1.5 me-2 mb-2">
        {name}
      </div>
    </Link>
  );
};
