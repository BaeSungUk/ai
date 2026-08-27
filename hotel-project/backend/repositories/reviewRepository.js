import Review from "../models/Review.js";
export const existsForReservation = (reservation) =>
  Review.exists({ reservation });
export const create = (values) => Review.create(values);
export const findByHotel = (hotel) =>
  Review.find({ hotel })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean();
export const removeOwned = (user, id) =>
  Review.findOneAndDelete({ _id: id, user });
export const ratingSummary = (hotel) =>
  Review.aggregate([
    { $match: { hotel } },
    { $group: { _id: null, rating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
