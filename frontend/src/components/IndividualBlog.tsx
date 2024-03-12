import { AuthorHeader } from "./AuthorHeader";
import { Bubble } from "./Bubble";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: {
    id?: number;
    bio: string;
    name: string;
  };
  topics?: {
    id?: number;
    name?: string;
  }[];
}

export const IndividualBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className="flex px-10 pt-12">
      <div className="flex flex-col w-full lg:w-3/4 justify-center px-4 py-6 m-4">
        <div className="text-5xl font-extrabold">{blog.title}</div>
        <div className="text-slate-500 pt-4">Posted on 2nd Dec, 2020</div>
        <div className="pt-4">{blog.content}</div>
      </div>
      <div className="w-1/4 mt-10 hidden lg:block">
        <div className="flex flex-col justify-center">
          {" "}
          <div className="text-slate-600 text-lg ml-6">Author</div>
          <div>
            <div>
              <AuthorHeader
                id={blog.author.id || 0}
                name={blog.author.name}
                bio={blog.author.bio}
              ></AuthorHeader>
            </div>
          </div>
          <div className="text-slate-600 text-lg ml-6">Topics</div>
          <div className="flex flex-wrap px-3 py-3 bg-slate-100 rounded-lg">
            {blog?.topics?.map((topic) => (
              <Bubble name={topic.name || ""} id={topic.id || 1}></Bubble>
            ))}
            {blog?.topics?.length === 0 && (
              <div className="p-4">No Topics to Display</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
