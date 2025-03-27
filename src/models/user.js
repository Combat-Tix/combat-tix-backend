import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      match: [/^\+?[\d\s-]+$/, "Please provide a valid phone number"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9\s\W]).+$/,
        "Password must contain at least one lowercase character, one uppercase character, and one number, symbol, or whitespace character",
      ],
    },
    role: {
      type: String,
      default: "fan",
      enum: ["fan", "fighter", "promoter", "admin"],
      required: [true, "Please provide a valid user role"],
    },

    // Fields Specific to Fighters
    stageName: { type: String }, // Optional for fighters
    dateOfBirth: {
      type: Date,
      message: "Please provide date of birth",
    },
    gymAffiliation: { type: String },
    companyName: { type: String },
    location: {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
    },

    // Fields Specific to Promoters
    businessType: {
      type: String,
    },
    businessAddress: {
      type: String,
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})(\/[^\s]*)?$/,
        "Please enter a valid website URL",
      ],
    },
    refreshToken: { type: String },
    blacklistedTokens: [{ type: String }],

    // Verification
    userIsVerified: {
      type: Boolean,
      default: false,
      required: [true, "Please provide user verification status"],
    },
    emailIsVerified: {
      type: Boolean,
      default: false,
      required: [true, "Please provide email verification status"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Indexes for Performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ userIsVerified: 1 });

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Password Hashing Before Saving
userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.model("User", userSchema);
