import mongoose from 'mongoose';

const SupportSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please provide user name'] },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide an email address'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email address',
      ],
    },
    message: {
      type: String,
      required: [true, 'Please provide support message'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Support', SupportSchema);
