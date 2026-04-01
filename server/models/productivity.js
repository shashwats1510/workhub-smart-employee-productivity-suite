import mongoose from "mongoose";

export const productivitySchema = new mongoose.Schema({
  tasks: {
    type: [mongoose.Schema.ObjectId],
    ref: "Task",
    default: [],
  },
  productivity: {
    type: Number,
    default: 0,
  },
});

const productivityModel = mongoose.model("Productivity", productivitySchema);
export default productivityModel;
