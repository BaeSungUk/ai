import { Router } from "express";
import authRoutes from "./authRoutes.js";
import hotelRoutes from "./hotelRoutes.js";
import roomRoutes from "./roomRoutes.js";
import reservationRoutes from "./reservationRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
const router = Router();
router.get("/health", (req, res) =>
  res.json({
    success: true,
    message: "StayHub API가 정상 작동 중입니다.",
    data: { status: "ok" },
  }),
);
router.use("/auth", authRoutes);
router.use("/hotels", hotelRoutes);
router.use("/rooms", roomRoutes);
router.use("/reservations", reservationRoutes);
router.use("/reviews", reviewRoutes);
export default router;
