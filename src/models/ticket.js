const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Please provide Event Id"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide User Id"],
    },
    qrCodeImageUrl: {
      type: String,
      required: [true, "Please provide url for the QrCode image"],
    },
    payment: {
      amount: { type: Number, required: [true, "Please provide amount paid"] },
      transactionId: {
        type: String,
        required: [true, "Please provide transaction id of payment"],
      },
      status: {
        type: String,
        enum: ["processing", "failed", "success"],
        required: [true, "Please provide payment id"],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
