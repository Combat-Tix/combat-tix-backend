import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please provide user name"] },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email address",
      ],
    },
    message: {
      type: String,
      required: [true, "Please provide support message"],
    },
    status: {
      type: String,
      default: "Open",
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      required: [true, "Please provide support status."],
    },
  },
  { timestamps: true }
);

supportSchema.index({ email: 1 });
supportSchema.index({ status: 1 });

export default mongoose.model("Support", supportSchema);
