import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/Spinner";
import { IndividualTopic } from "../components/IndividualTopic";
import { useTopic } from "../hooks";
import { BlogSkeleton } from "../components/BlogSkeleton";

export const Topic = () => {
  const { id } = useParams();
  const { loading, topic, blogs, users } = useTopic({
    id: id || "",
  });
  useEffect(() => {
    document.title = "Blogify | Topic Preview";
  }, []);
  if (loading) {
    return (
      <div className="flex flex-col">
        <Navbar />
        <div className="flex flex-col mt-16 justify-center items-center">
          <p className="text-5xl my-3 font-bold">Topic Name</p>
          <div className="flex gap-2 text-slate-500">
            <p>Topic |</p>
            <p> Followers |</p>
            <p> Stories</p>
          </div>

          <button className="mt-5 rounded-3xl text-white bg-gray-400 text-sm px-8 py-3 text-center inline-flex items-center">
            <Spinner size={4}></Spinner>
          </button>
        </div>
        <div className="flex mt-[3.5rem] justify-center">
          <div className="w-full mx-4 md:m-0 md:w-3/4 py-2 pl-7">
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
          <div className="w-1/4 md:mr-7 hidden md:block">
            <div>
              <div>Recommended Topics</div>
              <div className="flex justify-center p-10 items-center w-40">
                <Spinner />
              </div>
            </div>
            <div>
              <div className="mt-2 mb-1">People following this Topic</div>
              <div className="flex justify-center p-10 items-center w-40">
                <Spinner />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {
        <IndividualTopic
          id={topic?.id || 1}
          topic={topic?.name || ""}
          users={users}
          blogs={blogs}
        />
      }
    </div>
  );
};
