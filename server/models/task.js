import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema({
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  completedOn: {
    type: Date,
  },
  title: {
    type: String,
    required: true,
  }, 
  description: {
    type: String,
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

const taskModel = mongoose.model("Task", taskSchema);
export default taskModel;
