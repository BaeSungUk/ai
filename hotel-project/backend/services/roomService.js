import * as roomRepository from "../repositories/roomRepository.js";
import * as hotelRepository from "../repositories/hotelRepository.js";
import * as reservationRepository from "../repositories/reservationRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateNights, parseDateOnly } from "../utils/date.js";
export async function createRoom(v) {
  if (!(await hotelRepository.findById(v.hotel)))
    throw new ApiError(404, "존재하지 않는 호텔입니다.");
  return roomRepository.create(v);
}
export async function listRooms(hotel, { checkIn, checkOut } = {}) {
  const rooms = await roomRepository.findActiveByHotel(hotel);
  if (!checkIn || !checkOut) return rooms.map((room) => ({ ...room, isAvailable: true }));
  calculateNights(checkIn, checkOut);
  const start = parseDateOnly(checkIn);
  const end = parseDateOnly(checkOut);
  return Promise.all(rooms.map(async (room) => ({
    ...room,
    isAvailable: !(await reservationRepository.findOverlap(room._id, start, end)),
  })));
}
export async function getRoom(id) {
  const result = await roomRepository.findById(id);
  const r = result?.toObject ? result.toObject() : result;
  if (!r) throw new ApiError(404, "존재하지 않는 객실입니다.");
  return r;
}
export async function updateRoom(id, v) {
  const r = await roomRepository.update(id, v);
  if (!r) throw new ApiError(404, "존재하지 않는 객실입니다.");
  return r;
}
export async function deleteRoom(id) {
  const r = await roomRepository.remove(id);
  if (!r) throw new ApiError(404, "존재하지 않는 객실입니다.");
  return r;
}
