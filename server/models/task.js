import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema({
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }, 
  description: {
    type: string,
    required: false,
  },
  deadLine: {
    type: Date,
    required: false
  },
  status: {
    type: Boolean,
    required: true
  }
});

const taskModel = mongoose.model("Tasks", taskSchema);
export default taskModel;
