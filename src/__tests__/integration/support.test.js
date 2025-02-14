const Ticket = require("../../models/ticket");

describe("Ticket Model Tests", () => {
  it("Should the following fields be required (name,email,message)", () => {
    const ticket = new Ticket({ name: "Omosuyi Olawole", email: "test@gmail.com", message: "I am a boy" });
  });
});

const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please provide user name"] },
    email: { type: String, required: [true, "Please provide user name"] },
    message: {
      type: String,
      required: [true, "Please provide support message"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", SupportSchema);
