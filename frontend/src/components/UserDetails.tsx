import { BlogCard } from "./BlogCard";
import { Navbar } from "./Navbar";
import { UserHeader } from "./UserHeader";
import { UserSideBar } from "./UserSideBar";

export const UserDetails = ({
  id,
  name,
  bio,
  topics,
  blogs,
  followers,
  following,
}: {
  id: number | undefined;
  name?: string;
  bio?: string;
  topics?: { id: number; name: string }[];
  blogs?: {
    id: number;
    title: string;
    content: string;
  }[];
  followers?: { id: number; name: string; bio: string }[];
  following?: { id: number; name: string; bio: string }[];
  users?: { id: number; name: string; bio: string }[];
}) => {
  return (
    <div className="flex flex-col">
      <Navbar></Navbar>
      <UserHeader
        id={id}
        name={name}
        bio={bio}
        followers={followers?.length}
        following={following?.length}
        stories={blogs?.length}
      />
      {(blogs?.length || 0) > 0 && (
        <div className="mx-8 mt-2 text-left text-slate-700 font-extralight text-xl">
          Blogs by {name}
        </div>
      )}
      <div className="flex w-full mt-4">
        <div className="w-full mx-4 md:m-0 md:w-3/4">
          {(blogs || []).length > 0 ? (
            blogs?.map((blog) => (
              <BlogCard
                key={blog.id} // Remember to add a unique key for each mapped element
                id={blog.id}
                authorName={name || "Anonymous"}
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
          <UserSideBar
            topics={topics || []}
            followers={followers || []}
            following={following || []}
          ></UserSideBar>
        </div>
      </div>
    </div>
  );
};
