import { useParams } from "react-router-dom";
import { useBlog } from "../hooks";
import { IndividualBlog } from "../components/IndividualBlog";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/Spinner";
import { useEffect } from "react";

// good usecase of atomFamilies/selectorFamilies
export const Blog = () => {
  const { id } = useParams();

  const { loading, blog, imageUrl, imageName } = useBlog({
    id: id || "",
  });

  useEffect(() => {
    document.title = "Blogify | Blog Preview";
  }, []);
  if (loading) {
    return (
      <div>
        <div className="h-screen flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {blog && (
        <IndividualBlog blog={blog} imageUrl={imageUrl} imageName={imageName} />
      )}
    </div>
  );
};
