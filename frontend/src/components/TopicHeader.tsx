import axios from "axios";
import { BACKEND_URL } from "../config";
import { useEffect, useState } from "react";

export const TopicHeader = ({
  id,
  name,
  followers,
  stories,
}: {
  id: number;
  name: string;
  followers: number;
  stories: number;
}) => {
  const [followed, setFollowed] = useState(false);

  // to find if the user is already following the topic or not
  useEffect(() => {
    // Fetch initial followed state
    axios
      .get(`${BACKEND_URL}/api/v1/topic/${id}/follow`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setFollowed(response.data.following);
      })
      .catch((error) => {
        console.error("Error fetching initial followed state:", error);
      });
  }, [id]);

  function toggleFollow() {
    if (followed) {
      axios
        .post(
          `${BACKEND_URL}/api/v1/topic/${id}/unfollow`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(() => setFollowed(false));
    } else {
      axios
        .post(
          `${BACKEND_URL}/api/v1/topic/${id}/follow`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(() => setFollowed(true));
    }
  }
  return (
    <div className="flex flex-col mt-16 justify-center items-center">
      <p className="text-5xl my-3 font-bold">{name}</p>
      <div className="flex gap-2 text-slate-500">
        <p>Topic |</p>
        <p>
          {" "}
          {followers == 1 || followers == 0
            ? `${followers} Follower`
            : `${followers} Followers`}{" "}
          |
        </p>
        <p>
          {" "}
          {stories == 1 || stories == 0
            ? `${stories} Story`
            : `${stories} Stories`}
        </p>
      </div>
      {!followed && (
        <button
          type="button"
          onClick={toggleFollow}
          className="mt-5 rounded-3xl text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center"
        >
          Follow
        </button>
      )}
      {followed && (
        <button
          type="button"
          onClick={toggleFollow}
          className="mt-5 rounded-3xl text-white bg-slate-500 hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center"
        >
          Unfollow
        </button>
      )}
    </div>
  );
};
