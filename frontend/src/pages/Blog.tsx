import { useParams } from "react-router-dom";
import { useBlog } from "../hooks";
import { IndividualBlog } from "../components/IndividualBlog";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/Spinner";

// good usecase of atomFamilies/selectorFamilies
export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || "",
  });
  if (loading) {
    return (
      <div>
        <Navbar></Navbar>
        <div className="h-screen flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {blog && <IndividualBlog blog={blog} />}
    </div>
  );
};
