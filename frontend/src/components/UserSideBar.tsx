import { AuthorHeader } from "./AuthorHeader";
import { Bubble } from "./Bubble";

interface Topic {
  id: number;
  name: string;
}
interface User {
  id: number;
  name: string;
  bio: string;
}

export const UserSideBar = ({
  topics,
  followers,
  following,
}: {
  topics: Topic[];
  followers: User[];
  following: User[];
}) => {
  return (
    <div>
      {topics.length > 0 && <div>Topics followed By the User</div>}
      {topics.length > 0 && (
        <div className="flex flex-wrap py-3 px-3 bg-slate-100 rounded-lg">
          {topics.map((topic) => (
            <Bubble name={topic.name} id={topic.id}></Bubble>
          ))}
        </div>
      )}
      {followers.length > 0 ? (
        <div className="mt-2 mb-1">Followers</div>
      ) : (
        <div className="p-3">No Followers</div>
      )}
      <div>
        {followers.map((follower) => (
          <AuthorHeader
            id={follower.id}
            name={follower.name}
            bio={follower.bio}
          ></AuthorHeader>
        ))}
      </div>

      {following.length > 0 ? (
        <div className="mt-2 mb-1">Following</div>
      ) : (
        <div className="p-3">No Following</div>
      )}
      <div>
        {following.map((person) => (
          <AuthorHeader
            id={person.id}
            name={person.name}
            bio={person.bio}
          ></AuthorHeader>
        ))}
      </div>
    </div>
  );
};
