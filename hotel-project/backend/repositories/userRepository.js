import User from "../models/User.js";
export const findByEmail = (email, withPassword = false) =>
  withPassword
    ? User.findOne({ email }).select("+password")
    : User.findOne({ email });
export const existsByEmail = (email) => User.exists({ email });
export const create = (values) => User.create(values);
