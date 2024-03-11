import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/Spinner";
import { useAuthor } from "../hooks";
import { UserDetails } from "../components/UserDetails";

export const User = () => {
  const { id } = useParams();
  const { loading, author } = useAuthor({
    id: id || "",
  });
  useEffect(() => {
    document.title = "Blogify | User Preview";
  }, []);
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
      <UserDetails
        id={author?.id}
        name={author?.name}
        bio={author?.bio}
        topics={author?.topics}
        blogs={author?.blogs}
        followers={author?.followers}
        following={author?.following}
      ></UserDetails>
    </div>
  );
};
