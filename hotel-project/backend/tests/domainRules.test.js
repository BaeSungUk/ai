import mongoose from "mongoose";
import { describe, expect, it } from "vitest";
import { sortHotelRows } from "../utils/hotelSort.js";
import { asObjectId } from "../utils/objectId.js";

describe("hotel sorting", () => {
  const rows = [
    { name: "No room", minPrice: null, rating: 5 },
    { name: "Budget", minPrice: 100000, rating: 3 },
    { name: "Premium", minPrice: 250000, rating: 4 },
  ];

  it("keeps hotels without rooms last in ascending price order", () => {
    expect(sortHotelRows(rows, "priceAsc").map((hotel) => hotel.name)).toEqual([
      "Budget", "Premium", "No room",
    ]);
  });

  it("keeps hotels without rooms last in descending price order", () => {
    expect(sortHotelRows(rows, "priceDesc").map((hotel) => hotel.name)).toEqual([
      "Premium", "Budget", "No room",
    ]);
  });
});

describe("MongoDB id conversion", () => {
  it("converts a route string to ObjectId for aggregation matching", () => {
    const value = asObjectId("507f1f77bcf86cd799439011");
    expect(value).toBeInstanceOf(mongoose.Types.ObjectId);
    expect(value.toString()).toBe("507f1f77bcf86cd799439011");
  });
});
