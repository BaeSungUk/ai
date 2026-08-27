import mongoose from "mongoose";

import {
  createReservation as createReservationRepository,
  findOverlappingReservation,
  findReservationById,
  findReservationDetailById,
  findReservationsByUser,
} from "../repository/reservationRepository.js";

import { incrementRoomReservationVersion } from "../repository/roomRepository.js";

import AppError from "../util/AppError.js";

const DAY_MS = 24 * 60 * 60 * 1000;

const getDateOnly = (value = new Date()) => {
  const date = new Date(value);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const createReservation = async (data, userId) => {
  const { roomId, checkInDate, checkOutDate, guestCount } = data;

  if (!roomId || !checkInDate || !checkOutDate || !guestCount) {
    throw new AppError("예약 필수 정보를 입력해주세요.", 400);
  }

  const checkIn = getDateOnly(checkInDate);

  const checkOut = getDateOnly(checkOutDate);

  const today = getDateOnly();

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    throw new AppError("올바른 날짜를 입력해주세요.", 400);
  }

  // 과거 예약 방지
  if (checkIn < today) {
    throw new AppError("지난 날짜에는 예약할 수 없습니다.", 400);
  }

  // 체크아웃은 체크인 이후
  if (checkOut <= checkIn) {
    throw new AppError("체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.", 400);
  }

  const guests = Number(guestCount);
  const session = await mongoose.startSession();
  let createdReservation;

  try {
    await session.withTransaction(async () => {
      const room = await incrementRoomReservationVersion(roomId, session);

      if (!room) {
        throw new AppError("존재하지 않는 객실입니다.", 404);
      }

      if (!Number.isInteger(guests) || guests < 1 || guests > room.maxGuests) {
        throw new AppError(
          `예약 인원은 1명 이상 ${room.maxGuests}명 이하여야 합니다.`,
          400,
        );
      }

      const overlap = await findOverlappingReservation(
        roomId,
        checkIn,
        checkOut,
        session,
      );

      if (overlap) {
        throw new AppError("해당 날짜에 이미 예약된 객실입니다.", 409);
      }

      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / DAY_MS,
      );
      const totalPrice = room.price * nights;

      createdReservation = await createReservationRepository(
        {
          user: userId,
          hotel: room.hotel,
          room: room._id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestCount: guests,
          totalPrice,
        },
        session,
      );
    });

    return createdReservation;
  } finally {
    await session.endSession();
  }
};

export const getMyReservations = async (userId) => {
  return findReservationsByUser(userId);
};

export const getReservationDetail = async (reservationId, userId) => {
  const reservation = await findReservationDetailById(reservationId);

  if (!reservation) {
    throw new AppError("존재하지 않는 예약입니다.", 404);
  }

  if (reservation.user.toString() !== userId.toString()) {
    throw new AppError("본인의 예약만 조회할 수 있습니다.", 403);
  }

  return reservation;
};

export const cancelReservation = async (reservationId, userId) => {
  const reservation = await findReservationById(reservationId);

  if (!reservation) {
    throw new AppError("존재하지 않는 예약입니다.", 404);
  }

  if (reservation.user.toString() !== userId.toString()) {
    throw new AppError("본인의 예약만 취소할 수 있습니다.", 403);
  }

  if (reservation.status !== "confirmed") {
    throw new AppError("예약 완료 상태에서만 취소할 수 있습니다.", 400);
  }

  reservation.status = "cancelled";

  await reservation.save();

  return reservation;
};

export const checkInReservation = async (userId, reservationId) => {
  const reservation = await findReservationById(reservationId);

  if (!reservation) {
    throw new AppError("예약을 찾을 수 없습니다.", 404);
  }

  const reservationUserId = reservation.user?._id || reservation.user;

  if (reservationUserId.toString() !== userId.toString()) {
    throw new AppError("본인의 예약만 체크인할 수 있습니다.", 403);
  }

  if (reservation.status !== "confirmed") {
    throw new AppError("체크인할 수 없는 예약입니다.", 400);
  }

  const today = getDateOnly();

  const checkInDate = getDateOnly(reservation.checkInDate);

  const checkOutDate = getDateOnly(reservation.checkOutDate);

  // 체크인 전
  if (today < checkInDate) {
    throw new AppError("아직 체크인 날짜가 아닙니다.", 400);
  }

  // 체크아웃 날짜에는 새 체크인 불가
  if (today >= checkOutDate) {
    throw new AppError("체크인 가능한 기간이 지났습니다.", 400);
  }

  reservation.status = "checkedIn";

  reservation.actualCheckInAt = new Date();

  await reservation.save();

  return reservation;
};

export const checkOutReservation = async (userId, reservationId) => {
  const reservation = await findReservationById(reservationId);

  if (!reservation) {
    throw new AppError("예약을 찾을 수 없습니다.", 404);
  }

  const reservationUserId = reservation.user?._id || reservation.user;

  if (reservationUserId.toString() !== userId.toString()) {
    throw new AppError("본인의 예약만 체크아웃할 수 있습니다.", 403);
  }

  if (reservation.status !== "checkedIn") {
    throw new AppError("체크인 후 체크아웃할 수 있습니다.", 400);
  }

  const today = getDateOnly();

  const checkOutDate = getDateOnly(reservation.checkOutDate);

  if (today > checkOutDate) {
    throw new AppError("체크아웃 가능한 기간이 지났습니다.", 400);
  }

  reservation.status = "checkedOut";

  reservation.actualCheckOutAt = new Date();

  await reservation.save();

  return reservation;
};
