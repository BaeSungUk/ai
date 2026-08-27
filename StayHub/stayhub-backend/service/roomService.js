import {
  createRoom as createRoomRepository,
  deleteRoomById,
  findRoomById,
  findRoomDetailById,
  findRoomsByHotel,
} from "../repository/roomRepository.js";

import { findOverlappingReservation } from "../repository/reservationRepository.js";

import { findHotelById } from "../repository/hotelRepository.js";

import { existsConfirmedReservationByRoom } from "../repository/reservationRepository.js";

import AppError from "../util/AppError.js";

export const createRoom = async (hotelId, data, userId) => {
  const hotel = await findHotelById(hotelId);

  if (!hotel) {
    throw new AppError("존재하지 않는 호텔입니다.", 404);
  }

  if (hotel.createdBy.toString() !== userId.toString()) {
    throw new AppError("호텔 작성자만 객실을 등록할 수 있습니다.", 403);
  }

  const { roomName, price, maxGuests, description, image } = data;

  if (!roomName || price === undefined || maxGuests === undefined) {
    throw new AppError("객실 필수 정보를 입력해주세요.", 400);
  }

  if (Number(price) < 0 || Number(maxGuests) < 1) {
    throw new AppError("객실 가격 또는 최대 인원이 올바르지 않습니다.", 400);
  }

  return createRoomRepository({
    hotel: hotelId,
    roomName,
    price: Number(price),
    maxGuests: Number(maxGuests),
    description: description || "",
    image: image || "",
    createdBy: userId,
  });
};

export const getRooms = async (hotelId) => {
  const hotel = await findHotelById(hotelId);

  if (!hotel) {
    throw new AppError("존재하지 않는 호텔입니다.", 404);
  }

  return findRoomsByHotel(hotelId);
};

export const getRoomDetail = async (roomId) => {
  const room = await findRoomDetailById(roomId);

  if (!room) {
    throw new AppError("존재하지 않는 객실입니다.", 404);
  }

  return room;
};

export const updateRoom = async (roomId, data, userId) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("존재하지 않는 객실입니다.", 404);
  }

  if (room.createdBy.toString() !== userId.toString()) {
    throw new AppError("객실 작성자만 수정할 수 있습니다.", 403);
  }

  const allowedFields = [
    "roomName",
    "price",
    "maxGuests",
    "description",
    "image",
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      room[field] = data[field];
    }
  }

  if (room.price < 0 || room.maxGuests < 1) {
    throw new AppError("객실 정보가 올바르지 않습니다.", 400);
  }

  await room.save();

  return room;
};

export const deleteRoom = async (roomId, userId) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("존재하지 않는 객실입니다.", 404);
  }

  if (room.createdBy.toString() !== userId.toString()) {
    throw new AppError("객실 작성자만 삭제할 수 있습니다.", 403);
  }

  const hasReservation = await existsConfirmedReservationByRoom(roomId);

  if (hasReservation) {
    throw new AppError("예약이 존재하는 객실은 삭제할 수 없습니다.", 409);
  }

  await deleteRoomById(roomId);

  return null;
};

export const checkRoomAvailability = async (
  roomId,
  checkInDate,
  checkOutDate,
) => {
  const room = await findRoomById(roomId);

  if (!room) {
    throw new AppError("존재하지 않는 객실입니다.", 404);
  }

  if (!checkInDate || !checkOutDate) {
    throw new AppError("체크인과 체크아웃 날짜를 입력해주세요.", 400);
  }

  const checkIn = new Date(checkInDate);

  const checkOut = new Date(checkOutDate);

  if (checkIn >= checkOut) {
    throw new AppError("체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.", 400);
  }

  const reservation = await findOverlappingReservation(
    roomId,
    checkIn,
    checkOut,
  );

  return {
    available: !reservation,
  };
};
