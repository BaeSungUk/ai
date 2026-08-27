import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import Hotel from "./models/Hotel.js";
import { seedDatabase } from "./scripts/seed.js";

const port = Number(process.env.PORT || 3000);

connectDatabase(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stayhub")
  .then(async () => {
    if (process.env.AUTO_SEED !== "false" && (await Hotel.countDocuments()) === 0) {
      await seedDatabase({ connect: false });
      console.info("빈 데이터베이스에 샘플 호텔을 자동 생성했습니다.");
    }
    app.listen(port, () => console.info(`StayHub API: http://localhost:${port}`));
  })
  .catch((error) => {
    console.error(`MongoDB 연결 실패: ${error.message}`);
    process.exit(1);
  });
