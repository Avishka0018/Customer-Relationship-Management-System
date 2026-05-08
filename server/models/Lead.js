import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  content: String,
  createdBy: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const leadSchema = new mongoose.Schema(
  {
    name: String,
    company: String,
    email: String,
    phone: String,
    source: String,
    salesperson: String,
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"],
      default: "New",
    },
    value: Number,
    notes: [noteSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);