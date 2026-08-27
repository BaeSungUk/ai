import Hotel from "../models/Hotel.js";
export const find = (query) => Hotel.find(query).lean();
export const findById = (id) => Hotel.findById(id).lean();
export const create = (values) => Hotel.create(values);
export const update = (id, values) =>
  Hotel.findByIdAndUpdate(id, values, { new: true, runValidators: true });
export const remove = (id) => Hotel.findByIdAndDelete(id);
