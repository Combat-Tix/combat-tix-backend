const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please provide user name"] },
    email: { type: String, required: [true, "Please provide user email"] },
    message: {
      type: String,
      required: [true, "Please provide support message"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", SupportSchema);
