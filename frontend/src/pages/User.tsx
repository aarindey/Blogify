import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthor } from "../hooks";
import { UserDetails } from "../components/UserDetails";
import { UserSkeleton } from "../components/UserSkeleton";

export const User = () => {
  const { id } = useParams();
  const { loading, author } = useAuthor({
    id: id || "",
  });
  useEffect(() => {
    document.title = "Blogify | User Preview";
  }, []);
  if (loading) {
    return <UserSkeleton />;
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
