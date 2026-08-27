import express from "express";
import cors from "cors";

import authRoute from "./route/authRoute.js";
import hotelRoute from "./route/hotelRoute.js";
import roomRoute from "./route/roomRoute.js";
import reservationRoute from "./route/reservationRoute.js";
import reviewRoute from "./route/reviewRoute.js";

import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StayHub 서버가 정상적으로 실행 중입니다.",
    data: null,
  });
});

app.use("/api/auth", authRoute);

app.use("/api/hotels", hotelRoute);

app.use("/api/rooms", roomRoute);

app.use("/api/reservations", reservationRoute);

app.use("/api/reviews", reviewRoute);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;
