import { AuthorHeader } from "./AuthorHeader";
import { Bubble } from "./Bubble";

export const SideBar = () => {
  return (
    <div>
      <div>Recommended Topics</div>
      <div className="flex flex-wrap max-w-[18rem] p-2 bg-slate-100 rounded-lg">
        <Bubble name="Space"></Bubble>
        <Bubble name="tech"></Bubble>
        <Bubble name="nodejs"></Bubble>
        <Bubble name="express"></Bubble>
        <Bubble name="webdev"></Bubble>
        <Bubble name="frontend"></Bubble>
        <Bubble name="tech"></Bubble>
        <Bubble name="nodejs"></Bubble>
        <Bubble name="express"></Bubble>
        <Bubble name="webdev"></Bubble>
        <Bubble name="frontend"></Bubble>
      </div>
      <div className="mt-2 mb-1">Recommended People</div>
      <div>
        <AuthorHeader
          name="Aarin Dey"
          description="he is guy who loves coding and stuffs"
        />
        <AuthorHeader name="Miyoko" description="Make up is my thing" />
        <AuthorHeader name="Sukuza" description="Animation and space" />
        <AuthorHeader name="Raj Verma" description="Systems" />
        <AuthorHeader name="Kabir Singh" description="Coding and Fun" />
      </div>
    </div>
  );
};
