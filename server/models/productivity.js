import mongoose from "mongoose";

export const productivitySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  tasks: {
    type: [mongoose.Schema.ObjectId],
    required: true,
    default: [],
  },
  productivity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const productivityModel = mongoose.model("productivity", productivitySchema);
export default productivityModel;
