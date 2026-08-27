import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, index: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    images: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    amenities: [String],
  },
  { timestamps: true },
);
export default mongoose.model("Hotel", schema);
