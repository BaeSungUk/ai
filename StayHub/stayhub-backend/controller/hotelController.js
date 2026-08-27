import {
  createHotel as createHotelService,
  deleteHotel as deleteHotelService,
  getHotelDetail as getHotelDetailService,
  getHotels as getHotelsService,
  updateHotel as updateHotelService,
} from "../service/hotelService.js";
import { getMyHotels as getMyHotelsService } from "../service/hotelService.js";
import asyncHandler from "../util/asyncHandler.js";
import { sendSuccess } from "../util/response.js";

export const createHotel = asyncHandler(async (req, res) => {
  const hotel = await createHotelService(req.body, req.user._id);

  return sendSuccess(res, 201, "호텔이 등록되었습니다.", hotel);
});

export const getHotels = asyncHandler(async (req, res) => {
  const hotels = await getHotelsService(req.query);

  return sendSuccess(res, 200, "호텔 목록을 조회했습니다.", hotels);
});

export const getHotelDetail = asyncHandler(async (req, res) => {
  const hotel = await getHotelDetailService(req.params.hotelId);

  return sendSuccess(res, 200, "호텔을 조회했습니다.", hotel);
});

export const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await updateHotelService(
    req.params.hotelId,
    req.body,
    req.user._id,
  );

  return sendSuccess(res, 200, "호텔이 수정되었습니다.", hotel);
});

export const deleteHotel = asyncHandler(async (req, res) => {
  await deleteHotelService(req.params.hotelId, req.user._id);

  return sendSuccess(res, 200, "호텔이 삭제되었습니다.");
});

export const getMyHotels = asyncHandler(async (req, res) => {
  const hotels = await getMyHotelsService(req.user._id);

  return sendSuccess(res, 200, "내 호텔 목록 조회에 성공했습니다.", hotels);
});
