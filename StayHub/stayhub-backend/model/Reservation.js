import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
    },

    guestCount: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["confirmed", "checkedIn", "checkedOut", "cancelled"],
      default: "confirmed",
    },

    actualCheckInAt: {
      type: Date,
      default: null,
    },

    actualCheckOutAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

reservationSchema.index({
  room: 1,
  checkInDate: 1,
  checkOutDate: 1,
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
