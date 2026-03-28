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
  accountType: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  tasks: {
    type: [mongoose.Schema.ObjectId],
    default: [],
    required: true,
  },
  productivity: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

const userModel = mongoose.model("Users", userSchema);
export default userModel;
