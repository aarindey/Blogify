export const TextBox = ({
  message,
  isSender,
}: {
  message: string;
  isSender: boolean;
}) => {
  return (
    <>
      {" "}
      {isSender ? (
        <div className="flex justify-end">
          <div className="bg-green-300 rounded-lg p-2 m-2 w-1/2">{message}</div>
        </div>
      ) : (
        <div className="flex justify-start">
          <div className="bg-blue-200 rounded-lg p-2 m-2 w-1/2">{message}</div>
        </div>
      )}
    </>
  );
};
