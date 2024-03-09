export const Bubble = ({ name }: { name: string }) => {
  return (
    <div className="mt-1 w-fit text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-400 font-medium rounded-full text-sm px-3 py-1.5 text-center me-2 mb-2">
      {name}
    </div>
  );
};
