import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  tasks: {
    type: [mongoose.Schema.ObjectId],
    ref: "Task",
    default: [],
  },
  productivity: {
    type: mongoose.Schema.ObjectId,
    ref: "Productivity",
    default: null,
  },
});

const userModel = mongoose.model("Users", userSchema);
export default userModel;
