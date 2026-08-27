import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const clearDatabase = async () => {
  try {
    await mongoose.connect(
      process.env.DB_HOST,
      {
        dbName: process.env.DB_NAME
      }
    );

    console.log("MongoDB 연결 완료");

    await mongoose.connection.dropDatabase();

    console.log("StayHub 데이터 전체 삭제 완료");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

clearDatabase();