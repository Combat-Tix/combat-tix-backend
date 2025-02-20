import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Please provide Event Id'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide User Id'],
    },
    qrCodeImageUrl: {
      type: String,
      required: [true, 'Please provide url for the QrCode image'],
      match: [
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+)\.([a-zA-Z]{2,})(\/\S*)?$/,
        'Please enter a valid URL for QRcode Image',
      ],
    },
    payment: {
      amount: { type: Number, required: [true, 'Please provide amount paid'] },
      transactionId: {
        type: String,
        required: [true, 'Please provide transaction id of payment'],
      },
      status: {
        type: String,
        enum: ['processing', 'failed', 'success'],
        required: [true, 'Please provide payment status'],
      },
    },
  },
  { timestamps: true }
);
ticketSchema.index({ eventId: 1 });
ticketSchema.index({ userId: 1 });
export default mongoose.model('Ticket', ticketSchema);
