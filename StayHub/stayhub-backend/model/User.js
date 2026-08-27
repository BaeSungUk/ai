import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    userpw: {
      type: String,
      required: true,
      select: false,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    nickname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
