import { Avatar } from "./BlogCard";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: {
    bio: string;
    name: string;
  };
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
        <div className="text-slate-600 text-lg ml-6">Author</div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex items-center gap-3">
            <Avatar
              authorName={blog.author.name || "Anonymous"}
              padding="p-5"
            />
            <div>
              <div className="text-xl font-bold pt-2">
                {blog.author.name || "Anonymous"}
              </div>
              <div className="pt-2 text-slate-500">{blog.author.bio}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
