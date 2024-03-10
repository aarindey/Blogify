import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/Spinner";
import { IndividualTopic } from "../components/IndividualTopic";
import { useTopic } from "../hooks";

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
