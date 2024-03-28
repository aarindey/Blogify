import mongoose from "mongoose";

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Db is connected");
  });
};

export default connect;
