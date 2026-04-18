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
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, default: "" },
  post: {
    type: String,
    required: true,
    enum: ["Employee", "Manager", "Admin"],
    default: "Employee",
  },
  salary: { type: Number, required: true, default: 80000.0 },
  leaves: {
    taken: {
      type: [
        {
          leaveType: { type: String, enum: ["sick", "casual"], required: true },
          date: { type: Date, required: true },
          reason: { type: String, required: true },
        },
      ],
      default: [],
    },
    sickLeave: {
      total: { type: Number, default: 12 },
      remaining: { type: Number, default: 12 },
    },
    casualLeave: {
      total: { type: Number, default: 10 },
      remaining: { type: Number, default: 10 },
    },
  },

  // --- UPDATED ATTENDANCE SCHEMA ---
  attendance: {
    type: [
      {
        date: { type: Date, required: true },
        status: {
          type: String,
          enum: ["Present", "Absent", "Half-day", "Late"],
          default: "Present",
        },
        clockIn: { type: Date },
        clockOut: { type: Date },
      },
    ],
    default: [],
  },
  // ---------------------------------

  phoneNo: { type: String, required: true, default: "" },
  dob: { type: Date, required: true },
  tasks: { type: [mongoose.Schema.ObjectId], ref: "Task", default: [] },
  productivity: {
    type: Number,
    default: 100,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {}
});

const userModel = mongoose.model("Users", userSchema);
export default userModel;
