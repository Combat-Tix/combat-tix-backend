import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    flags: {
      isHeroBanner: {
        //<--------- flag for banner event on the home page hero page ---------->
        value: { type: Boolean, default: false },
        priority: { type: Number, default: 0 },
      },
      isFeatured: {
        //<--------- flag for featured events on the home page ---------->
        value: { type: Boolean, default: false },
        priority: { type: Number, default: 0 },
      },
      isMainEvent: {
        //<--------- flag for main event on the event page ---------->
        value: { type: Boolean, default: false },
        priority: { type: Number, default: 0 },
      },
    },
    promoterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide promoter id."],
    },
    name: { type: String, required: [true, "Please provide Event name."] },
    venue: {
      type: String,
      required: [true, "Please provide Event venue."],
    },
    capacity: {
      type: Number,
      required: [true, "Please provide Event capacity."],
    },
    location: {
      street: {
        type: String,
        required: [true, "Please enter the street name."],
      },
      number: {
        type: Number,
        required: [true, "Please enter venue number."],
      },
      city: {
        type: String,
        required: [true, "Please enter the city name."],
      },
      postalCode: {
        type: String,
        required: [true, "Please enter postal code."],
      },
      country: {
        type: String,
        required: [true, "Please enter country name"],
      },
      town: { type: String },
      county: { type: String },
    },
    eventDateTime: {
      date: {
        type: Date,
        required: [true, "Please provide date for the event."],
      },
      startTime: {
        type: String,
        required: [true, "Please provide start time for the event."],
      },
      endTime: {
        type: String,
        required: [true, "Please provide end time for the event."],
      },
    },
    eventType: {
      type: String,
      enum: ["Boxing", "MMA", "Kickboxing", "BJJ", "Other"],
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
          type: Number,
          required: function () {
            return !!this.type;
          },
          message: (props) =>
            `Please provide a price for the ${props.parent.type} ticket.`,
        },
        capacity: {
          type: Number,
          required: function () {
            return !!this.type;
          },
          message: (props) =>
            `Please provide capacity for the ${props.parent.type} ticket.`,
        },
      },
    ],
    bannerURL: {
      type: String,
      required: [true, "Please provide Banner Image."],
      match: [
        /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})(\/[^\s]*)?$/,
        "Please enter a valid website URL",
      ],
    },
    images: {
      type: [String],
      match: [
        /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})(\/[^\s]*)?$/,
        "Please enter a valid URL for each image",
      ],
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
  { timestamps: true, validateBeforeSave: true }
);

eventSchema.index({ promoterId: 1, createdAt: -1 });
eventSchema.index({ name: 1 });
eventSchema.index({ venue: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ fights: 1 });

//< -------- VALIDATIONS ---------->
eventSchema.path("ticketTypes").validate(function (value) {
  return value.length > 0;
}, "Please provide at least one ticket type.");

eventSchema.path("ticketTypes").validate(function (value) {
  const ticketSet = new Set(value.map((ticket) => ticket.type));
  return ticketSet.size === value.length;
}, "Each ticket type must be unique.");

eventSchema.path("capacity").validate(function (value) {
  const totalCapacityForAllTicketTypes = this.ticketTypes.reduce(
    (total, ticket) => {
      return total + ticket.capacity;
    },
    0
  );
  return totalCapacityForAllTicketTypes === value;
}, "Event Capacity does not match the total capacity of all ticket types.");

export default mongoose.model("Event", eventSchema);

// Consider validating unique fighter IDs in 1v1 matches.

// The test for 1v1 matches doesn't verify that the same fighter isn't fighting themselves
