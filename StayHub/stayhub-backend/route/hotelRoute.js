import express from "express";

import {
  createHotel,
  deleteHotel,
  getHotelDetail,
  getHotels,
  updateHotel,
  getMyHotels,
} from "../controller/hotelController.js";

import { createRoom, getRooms } from "../controller/roomController.js";

import { createReview, getReviews } from "../controller/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyHotels);

// 호텔 목록
router.get("/", getHotels);

// 호텔 등록
// 로그인만 하면 가능
router.post("/", authMiddleware, createHotel);

// 객실 목록
router.get("/:hotelId/rooms", getRooms);

// 객실 등록
// 실제 작성자 검사는 Service에서
router.post("/:hotelId/rooms", authMiddleware, createRoom);

// 후기
router.get("/:hotelId/reviews", getReviews);

router.post("/:hotelId/reviews", authMiddleware, createReview);

// 호텔 상세
router.get("/:hotelId", getHotelDetail);

// 호텔 수정
router.patch("/:hotelId", authMiddleware, updateHotel);

// 호텔 삭제
router.delete("/:hotelId", authMiddleware, deleteHotel);

export default router;
