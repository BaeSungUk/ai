import User from "../model/User.js";

export const findByUserid = async (userid) => {
  return User.findOne({ userid });
};

export const findByUseridWithPassword = async (userid) => {
  return User.findOne({ userid }).select("+userpw");
};

export const findByEmail = async (email) => {
  return User.findOne({ email });
};

export const findUserById = async (userId) => {
  return User.findById(userId);
};

export const createUser = async (userData) => {
  return User.create(userData);
};
