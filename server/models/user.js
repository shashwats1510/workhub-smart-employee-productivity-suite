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
});

const userModel = mongoose.model("Users", userSchema);
export default userModel;
