import mongoose from "mongoose";
import bcrypt from "bcryptjs"; //TODO--------> switch to bcrypt module soon
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      validate: {
        validator: (value) => value && value.trim().split(" ").length >= 2,
        message: "Please provide Last name and First name",
      },
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please provide phone number"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
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
      type: String,
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
      address: { type: String },
      isVerified: { type: Boolean },
    },
    website: { type: String },
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
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.business && this.business.verificationNumber && this.isModified("business.verificationNumber")) {
    this.business.isVerified = false; //assign a default value of false to the business verified field if verification number is supplied
  }
  if (this.password && this.isModified("password")) {
    const salt = await genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});

export default mongoose.model("User", UserSchema);
