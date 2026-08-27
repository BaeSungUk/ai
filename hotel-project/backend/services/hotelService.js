import * as hotelRepository from "../repositories/hotelRepository.js";
import * as roomRepository from "../repositories/roomRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { sortHotelRows } from "../utils/hotelSort.js";
export async function listHotels({ location, name, sort } = {}) {
  const q = {};
  if (location) q.location = { $regex: location, $options: "i" };
  if (name) q.name = { $regex: name, $options: "i" };
  const hotels = await hotelRepository.find(q);
  const rows = await Promise.all(
    hotels.map(async (h) => ({
      ...h,
      minPrice:
        (
          await roomRepository.findLowest(h._id)
        )?.price ?? null,
    })),
  );
  return sortHotelRows(rows, sort);
}
export async function getHotel(id) {
  const h = await hotelRepository.findById(id);
  if (!h) throw new ApiError(404, "존재하지 않는 호텔입니다.");
  return h;
}
export const createHotel = (v) => hotelRepository.create(v);
export async function updateHotel(id, v) {
  const h = await hotelRepository.update(id, v);
  if (!h) throw new ApiError(404, "존재하지 않는 호텔입니다.");
  return h;
}
export async function deleteHotel(id) {
  const h = await hotelRepository.remove(id);
  if (!h) throw new ApiError(404, "존재하지 않는 호텔입니다.");
  await roomRepository.removeByHotel(id);
  return h;
}
