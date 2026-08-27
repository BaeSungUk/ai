import * as reservationRepository from "../repositories/reservationRepository.js";
import * as roomRepository from "../repositories/roomRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateNights, parseDateOnly } from "../utils/date.js";
export async function createReservation(userId, v) {
  const room = await roomRepository.findById(v.room);
  if (!room || !room.isActive)
    throw new ApiError(404, "예약 가능한 객실이 아닙니다.");
  const guests = Number(v.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > room.capacity)
    throw new ApiError(400, "객실 최대 인원을 초과했습니다.");
  const checkIn = parseDateOnly(v.checkIn),
    checkOut = parseDateOnly(v.checkOut),
    today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (checkIn < today)
    throw new ApiError(400, "오늘 이전 날짜는 선택할 수 없습니다.");
  const nights = calculateNights(v.checkIn, v.checkOut);
  if (
    await reservationRepository.findOverlap(room._id, checkIn, checkOut)
  )
    throw new ApiError(409, "선택한 날짜에 이미 예약된 객실입니다.");
  const created = await reservationRepository.create({
    user: userId,
    hotel: room.hotel,
    room: room._id,
    checkIn,
    checkOut,
    guests,
    nights,
    totalPrice: room.price * nights,
  });
  return reservationRepository.findOwned(userId, created._id);
}
export const listReservations = (u) =>
  reservationRepository.findByUser(u);
export async function getReservation(u, id) {
  const x = await reservationRepository.findOwned(u, id);
  if (!x) throw new ApiError(404, "존재하지 않는 예약입니다.");
  return x;
}
export async function cancelReservation(u, id) {
  const x = await reservationRepository.cancelOwned(u, id);
  if (!x) throw new ApiError(404, "취소할 수 있는 예약이 없습니다.");
  return x;
}
