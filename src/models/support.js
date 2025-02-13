const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema(
  {
    Name: { type: String, required: [true, "Please provide user name"] },
    Email: { type: String, required: [true, "Please provide user name"] },
    message: { type: String, required: [true, "Please provide support message"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", SupportSchema);
