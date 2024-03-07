import { Avatar } from "./BlogCard";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
  };
}

export const IndividualBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className="grid grid-cols-12 px-10 w-full pt-12 max-w-screen-xl">
      <div className="col-span-8 flex flex-col justify-center px-4 py-6">
        <div className="text-5xl font-extrabold">{blog.title}</div>
        <div className="text-slate-500 pt-4">Posted on 2nd Dec, 2020</div>
        <div className="pt-4">{blog.content}</div>
      </div>
      <div className="col-span-4 col-start-10 mt-5 hidden lg:block">
        <div className="text-slate-600 text-lg">Author</div>
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
              <div className="pt-2 min-w-xl w-[20rem]  text-slate-500">
                Description and phrase that describes the author
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
