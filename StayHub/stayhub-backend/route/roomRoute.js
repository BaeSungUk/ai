import express from "express";

import {
  checkRoomAvailability,
  deleteRoom,
  getRoomDetail,
  updateRoom,
} from "../controller/roomController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:roomId/availability", checkRoomAvailability);

router.get("/:roomId", getRoomDetail);

router.patch("/:roomId", authMiddleware, updateRoom);

router.delete("/:roomId", authMiddleware, deleteRoom);

export default router;
