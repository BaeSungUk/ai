import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import "dotenv/config";
import mongoose from "mongoose";

import Hotel from "../model/Hotel.js";
import Reservation from "../model/Reservation.js";
import Room from "../model/Room.js";
import User from "../model/User.js";
import { createReservation } from "../service/reservationService.js";

const runId = `concurrency-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const fixture = {};

const dateFromToday = (days) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

before(async () => {
  assert.ok(process.env.TEST_DB_NAME, "TEST_DB_NAME is required");
  assert.notEqual(process.env.TEST_DB_NAME, process.env.DB_NAME);

  await mongoose.connect(process.env.DB_HOST, {
    dbName: process.env.TEST_DB_NAME,
    serverSelectionTimeoutMS: 10000,
  });

  fixture.user = await User.create({
    userid: `${runId}-user`,
    userpw: "test-only-password-hash",
    username: "Concurrency Test",
    nickname: "Concurrency",
    email: `${runId}@example.com`,
  });

  fixture.hotel = await Hotel.create({
    hotelName: `${runId}-hotel`,
    region: "test",
    address: `${runId}-address`,
    description: "Concurrency test fixture",
    price: 100000,
    createdBy: fixture.user._id,
  });

  fixture.room = await Room.create({
    hotel: fixture.hotel._id,
    roomName: `${runId}-room`,
    price: 120000,
    maxGuests: 2,
    createdBy: fixture.user._id,
  });
});

after(async () => {
  if (fixture.room) {
    await Reservation.deleteMany({ room: fixture.room._id });
    await Room.deleteOne({ _id: fixture.room._id });
  }
  if (fixture.hotel) await Hotel.deleteOne({ _id: fixture.hotel._id });
  if (fixture.user) await User.deleteOne({ _id: fixture.user._id });
  await mongoose.disconnect();
});

test("room schema keeps a hidden monotonic reservation version", () => {
  const versionPath = Room.schema.path("reservationVersion");

  assert.ok(versionPath);
  assert.equal(versionPath.instance, "Number");
  assert.equal(versionPath.defaultValue, 0);
  assert.equal(versionPath.options.select, false);
});

test("concurrent overlapping reservations create exactly one booking", async () => {
  const request = {
    roomId: fixture.room._id.toString(),
    checkInDate: dateFromToday(30),
    checkOutDate: dateFromToday(32),
    guestCount: 2,
  };

  const results = await Promise.allSettled(
    Array.from({ length: 8 }, () =>
      createReservation(request, fixture.user._id),
    ),
  );
  const fulfilled = results.filter((result) => result.status === "fulfilled");
  const rejected = results.filter((result) => result.status === "rejected");

  assert.equal(fulfilled.length, 1);
  assert.equal(rejected.length, 7);
  assert.ok(rejected.every((result) => result.reason.statusCode === 409));
  assert.equal(
    await Reservation.countDocuments({ room: fixture.room._id }),
    1,
  );

  const adjacent = await createReservation(
    {
      ...request,
      checkInDate: request.checkOutDate,
      checkOutDate: dateFromToday(34),
    },
    fixture.user._id,
  );

  assert.equal(adjacent.room.toString(), fixture.room._id.toString());
  assert.equal(
    await Reservation.countDocuments({ room: fixture.room._id }),
    2,
  );
});
