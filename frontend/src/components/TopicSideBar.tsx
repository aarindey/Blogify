import { SideBar } from "./SideBar";

interface User {
  id: number;
  name: string;
  bio: string;
}

export const TopicSideBar = ({ users }: { users: User[] }) => {
  return (
    <div>
      <SideBar users={users} type="topic"></SideBar>
    </div>
  );
};
