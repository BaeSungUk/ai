import "dotenv/config";
import bcrypt from "bcrypt";
import { connectDatabase } from "../config/db.js";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { hotels } from "../data/seedData.js";
export async function seedDatabase({ connect = true } = {}) {
  if (connect) {
    await connectDatabase(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stayhub",
    );
  }
  for (const h of hotels) {
    const { rooms, key, ...hotel } = h;
    const saved = await Hotel.findOneAndUpdate({ name: hotel.name }, hotel, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    await Room.deleteMany({ hotel: saved._id });
    await Room.insertMany(
      rooms.map(([name, price, capacity], i) => ({
        hotel: saved._id,
        name,
        description: `${hotel.name}의 편안한 ${name} 객실입니다.`,
        price,
        capacity,
        images: [hotel.images[0]],
        isActive: true,
      })),
    );
  }
  const password = await bcrypt.hash("stayhub123", 10);
  await User.findOneAndUpdate(
    { email: "admin@stayhub.com" },
    { name: "관리자", email: "admin@stayhub.com", password, role: "admin" },
    { upsert: true },
  );
  await User.findOneAndUpdate(
    { email: "user@stayhub.com" },
    { name: "홍길동", email: "user@stayhub.com", password, role: "user" },
    { upsert: true },
  );
  return { hotels: hotels.length, users: 2 };
}

const isDirectRun = process.argv[1]?.replace(/\\/g, "/").endsWith("/scripts/seed.js");
if (isDirectRun) {
  seedDatabase()
    .then((result) => {
      console.info(`StayHub seed 완료: 호텔 ${result.hotels}개, 사용자 ${result.users}명`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
