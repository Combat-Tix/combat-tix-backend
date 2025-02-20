import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide phone number"],
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
    dateOfBirth: {
      //required for fighter only
      type: Date,
      validate: {
        validator: function (value) {
          return this.role !== "fighter" || (this.role === "fighter" && value);
        },
        message: "Please provide date of birth",
      },
    },
    gymAffiliation: { type: String },
    business: {
      name: { type: String },
      verificationNumber: {
        //required if  business name is provided
        type: String,
        validate: {
          validator: function (value) {
            return !this.business.name || (this.business.name && value);
          },
          message: "Business registration number is required",
        },
      },
      address: {
        street: {
          //required if  business name is provided
          type: String,
          validate: {
            validator: function (value) {
              return !this.business.name || (this.business.name && value);
            },
            message: "Please enter the street where your business is located.",
          },
        },
        city: {
          //required if  business name is provided
          type: String,
          validate: {
            validator: function (value) {
              return !this.business.name || (this.business.name && value);
            },
            message: "Please enter the city where your business is located.",
          },
        },
        postalCode: {
          //required if  business name is provided
          type: Number,
          validate: {
            validator: function (value) {
              return !this.business.name || (this.business.name && value);
            },
            message: "Please enter your business's postal code.",
          },
        },
        country: {
          //required if  business name is provided
          type: String,
          validate: {
            validator: function (value) {
              return !this.business.name || (this.business.name && value);
            },
            message: "Please enter the country where your business is located.",
          },
        },
        town: { type: String },
        county: { type: String },
      },
      isVerified: { type: Boolean },
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})(\/\S*)?$/,
        "Please enter a valid website URL",
      ],
    },
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

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ userIsVerified: 1 });

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (this.business?.verificationNumber && this.isModified("business.verificationNumber")) {
    this.business.isVerified = false; //assign a default value of false to the business verified field if verification number is supplied
  }
  if (this.password && this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});

export default mongoose.model("User", userSchema);
