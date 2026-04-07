import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    default: "",
  },
  phoneNo: {
    type: String,
    required: true,
    default: "",
  },
  dob: {
    type: Date,
    required: true,
  },
  post: {
    type: String,
    required: true,
    enum: ["Employee", "Manager", "Admin"],
    default: "Employee",
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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model("Users", userSchema);
export default userModel;
