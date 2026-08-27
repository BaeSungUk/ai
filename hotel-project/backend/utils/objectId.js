import mongoose from "mongoose";
import { ApiError } from "./ApiError.js";

export function asObjectId(value) {
  if (!mongoose.isValidObjectId(value)) {
    throw new ApiError(400, "올바르지 않은 ID입니다.");
  }
  return new mongoose.Types.ObjectId(value);
}
