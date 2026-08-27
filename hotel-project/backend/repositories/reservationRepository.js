import Reservation from "../models/Reservation.js";
const populate = (q) =>
  q
    .populate("hotel", "name location images")
    .populate("room", "name price capacity images");
export const findOverlap = (room, checkIn, checkOut) =>
  Reservation.exists({
    room,
    status: "confirmed",
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  });
export const create = (values) => Reservation.create(values);
export const findByUser = (user) =>
  populate(Reservation.find({ user }).sort({ createdAt: -1 }));
export const findOwned = (user, id) =>
  populate(Reservation.findOne({ _id: id, user }));
export const cancelOwned = (user, id) =>
  Reservation.findOneAndUpdate(
    { _id: id, user, status: "confirmed" },
    { status: "cancelled" },
    { new: true },
  );
export const findValid = (query) =>
  Reservation.findOne({ ...query, status: "confirmed" });
