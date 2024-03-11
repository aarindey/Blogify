export const Quote = () => {
  return (
    <div className="bg-[rgb(245,130,32)] h-screen flex justify-center flex-col">
      <div className="flex justify-center my-10 -mt-20">
        <div className="w-30 h-30 -ml-6 ">
          {" "}
          <img src="../../vite.svg" className="rounded-xl" alt="logo"></img>
        </div>
        <div className="text-7xl font-bold flex justify-center p-3 text-white text-center max-w-sm py-6 rounded-3xl">
          Blogify
        </div>
      </div>
      <div className="flex justify-center">
        {" "}
        <div className="max-w-lg flex flex-col">
          {" "}
          <div className="text-3xl font-bold text-center text-white my-3">
            <div>
              {" "}
              Transform your experiences and passions into captivating stories,
              then share them with the world on Blogify!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
