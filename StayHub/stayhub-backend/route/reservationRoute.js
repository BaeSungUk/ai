import express from "express";

import {
  cancelReservation,
  createReservation,
  getReservationDetail,
  getReservations,
  checkInReservation,
  checkOutReservation,
} from "../controller/reservationController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createReservation);

router.get("/", getReservations);

router.get("/:reservationId", getReservationDetail);

router.patch("/:reservationId/cancel", cancelReservation);

router.patch("/:reservationId/check-in", checkInReservation);

router.patch("/:reservationId/check-out", checkOutReservation);

export default router;
