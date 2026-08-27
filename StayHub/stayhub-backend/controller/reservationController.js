import {
  cancelReservation as cancelReservationService,
  createReservation as createReservationService,
  getMyReservations,
  getReservationDetail as getReservationDetailService,
} from "../service/reservationService.js";

import asyncHandler from "../util/asyncHandler.js";

import { sendSuccess } from "../util/response.js";

import {
  checkInReservation as checkInReservationService,
  checkOutReservation as checkOutReservationService,
} from "../service/reservationService.js";

export const createReservation = asyncHandler(async (req, res) => {
  const reservation = await createReservationService(req.body, req.user._id);

  return sendSuccess(res, 201, "예약이 완료되었습니다.", reservation);
});

export const getReservations = asyncHandler(async (req, res) => {
  const reservations = await getMyReservations(req.user._id);

  return sendSuccess(res, 200, "예약 목록을 조회했습니다.", reservations);
});

export const getReservationDetail = asyncHandler(async (req, res) => {
  const reservation = await getReservationDetailService(
    req.params.reservationId,
    req.user._id,
  );

  return sendSuccess(res, 200, "예약을 조회했습니다.", reservation);
});

export const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await cancelReservationService(
    req.params.reservationId,
    req.user._id,
  );

  return sendSuccess(res, 200, "예약이 취소되었습니다.", reservation);
});

export const checkInReservation = asyncHandler(async (req, res) => {
  const reservation = await checkInReservationService(
    req.user._id,
    req.params.reservationId,
  );

  return sendSuccess(res, 200, "체크인이 완료되었습니다.", reservation);
});

export const checkOutReservation = asyncHandler(async (req, res) => {
  const reservation = await checkOutReservationService(
    req.user._id,
    req.params.reservationId,
  );

  return sendSuccess(res, 200, "체크아웃이 완료되었습니다.", reservation);
});
