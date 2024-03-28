import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
});

const User = mongoose.model("User", userSchema);
export default User;
