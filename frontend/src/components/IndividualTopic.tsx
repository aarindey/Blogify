import { BlogCard } from "./BlogCard";
import { Navbar } from "./Navbar";
import { TopicHeader } from "./TopicHeader";
import { TopicSideBar } from "./TopicSideBar";

export const IndividualTopic = ({
  id,
  topic,
  blogs,
  users,
}: {
  id: number;
  topic: string;
  blogs: {
    id: number;
    title: string;
    content: string;
    author: { id?: number; name: string };
  }[];
  users: { id: number; name: string; bio: string }[];
}) => {
  return (
    <div className="flex flex-col">
      <Navbar></Navbar>
      <TopicHeader
        id={id}
        name={topic}
        followers={users.length}
        stories={blogs.length}
      />
      <div className="mx-8 mt-2 text-left text-slate-700 font-extralight text-xl">
        Blogs on {topic}
      </div>
      <div className="flex w-full mt-4">
        <div className="w-full mx-4 md:m-0 md:w-3/4">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogCard
                key={blog.id} // Remember to add a unique key for each mapped element
                id={blog.id}
                authorName={blog.author.name}
                title={blog.title}
                content={blog.content}
                publishedDate="21st Jan 2023"
              />
            ))
          ) : (
            <div className="flex justify-center h-screen mt-10 font-extralight text-xl">
              {" "}
              <p>No Blogs Present</p>
            </div>
          )}
        </div>
        <div className="w-1/4 md:mr-7 hidden md:block">
          <TopicSideBar users={users}></TopicSideBar>
        </div>
      </div>
    </div>
  );
};
