import {
  checkRoomAvailability as checkRoomAvailabilityService,
  createRoom as createRoomService,
  deleteRoom as deleteRoomService,
  getRoomDetail as getRoomDetailService,
  getRooms as getRoomsService,
  updateRoom as updateRoomService,
} from "../service/roomService.js";

import asyncHandler from "../util/asyncHandler.js";

import { sendSuccess } from "../util/response.js";

export const createRoom = asyncHandler(async (req, res) => {
  const room = await createRoomService(
    req.params.hotelId,
    req.body,
    req.user._id,
  );

  return sendSuccess(res, 201, "객실이 등록되었습니다.", room);
});

export const getRooms = asyncHandler(async (req, res) => {
  const rooms = await getRoomsService(req.params.hotelId);

  return sendSuccess(res, 200, "객실 목록을 조회했습니다.", rooms);
});

export const getRoomDetail = asyncHandler(async (req, res) => {
  const room = await getRoomDetailService(req.params.roomId);

  return sendSuccess(res, 200, "객실을 조회했습니다.", room);
});

export const updateRoom = asyncHandler(async (req, res) => {
  const room = await updateRoomService(
    req.params.roomId,
    req.body,
    req.user._id,
  );

  return sendSuccess(res, 200, "객실이 수정되었습니다.", room);
});

export const deleteRoom = asyncHandler(async (req, res) => {
  await deleteRoomService(req.params.roomId, req.user._id);

  return sendSuccess(res, 200, "객실이 삭제되었습니다.");
});

export const checkRoomAvailability = asyncHandler(async (req, res) => {
  const result = await checkRoomAvailabilityService(
    req.params.roomId,
    req.query.checkInDate,
    req.query.checkOutDate,
  );

  return sendSuccess(
    res,
    200,
    result.available ? "예약 가능한 객실입니다." : "예약할 수 없는 객실입니다.",
    result,
  );
});
