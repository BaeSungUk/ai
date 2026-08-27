import Room from "../models/Room.js";
export const findById = (id) => Room.findById(id);
export const findActiveByHotel = (hotel) =>
  Room.find({ hotel, isActive: true }).lean();
export const findLowest = (hotel) =>
  Room.findOne({ hotel, isActive: true }).sort({ price: 1 }).lean();
export const create = (values) => Room.create(values);
export const update = (id, values) =>
  Room.findByIdAndUpdate(id, values, { new: true, runValidators: true });
export const remove = (id) => Room.findByIdAndDelete(id);
export const removeByHotel = (hotel) => Room.deleteMany({ hotel });
