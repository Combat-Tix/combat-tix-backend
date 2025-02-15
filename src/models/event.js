const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    promoterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide promoter id."],
    },
    name: { type: String, required: [true, "Please provide Event name."] },
    venue: {
      type: String,
      required: [true, "Please provide venue for the event."],
    },
    capacity: {
      type: Number,
      required: [true, "Please provide Event capacity."],
    },
    location: {
      type: String,
      required: [true, "Please provide Event location."],
    },
    eventDateTime: {
      date: {
        type: Date,
        required: [true, "Please provide date for the event."],
      },
      time: {
        type: String,
        required: [true, "Please provide time for the event."],
      },
    },
    eventType: {
      type: String,
      required: [true, "Please provide an event type."],
    },
    ticketTypes: [
      {
        type: {
          type: String,
          enum: ["VIP", "general", "standing", "seating"],
          required: [true, "Please provide ticket type."],
        },
        price: {
          type: String,
          required: function () {
            return this.type ? true : false;
          },
          message: (props) => `Please provide a price for the ${props.parent.type} ticket.`,
        },
      },
    ],
    bannerURL: {
      type: String,
      required: [true, "Please provide banner image."],
    },
    images: {
      type: Array,
    },
    videos: {
      type: Array,
    },
    splitPercentage: {
      type: Number,
      required: [true, "Please provide split percentage."],
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    promoCode: { type: String },
    fights: [
      {
        teams: [
          {
            teamName: { type: String },
            fighters: [
              {
                fighterId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                  required: [true, "Please provide fighter id"],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
