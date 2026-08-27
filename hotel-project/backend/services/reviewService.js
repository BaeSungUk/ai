import * as reviewRepository from "../repositories/reviewRepository.js";
import * as reservationRepository from "../repositories/reservationRepository.js";
import * as hotelRepository from "../repositories/hotelRepository.js";
import { ApiError } from "../utils/ApiError.js";
import { asObjectId } from "../utils/objectId.js";
async function sync(hotel) {
  const hotelId = asObjectId(hotel._id || hotel);
  const rows = await reviewRepository.ratingSummary(hotelId);
  await hotelRepository.update(hotelId, {
    rating: rows[0]?.rating || 0,
    reviewCount: rows[0]?.count || 0,
  });
}
export async function createReview(u, v) {
  const rating = Number(v.rating);
  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    !v.content?.trim()
  )
    throw new ApiError(400, "별점과 후기 내용을 올바르게 입력해 주세요.");
  const reservation = await reservationRepository.findValid({
    _id: v.reservation,
    user: u,
    hotel: v.hotel,
    status: "confirmed",
  });
  if (!reservation)
    throw new ApiError(
      403,
      "해당 호텔의 유효한 예약 사용자만 후기를 작성할 수 있습니다.",
    );
  if (await reviewRepository.existsForReservation(v.reservation))
    throw new ApiError(409, "이미 후기를 작성한 예약입니다.");
  const review = await reviewRepository.create({
    user: u,
    hotel: v.hotel,
    reservation: v.reservation,
    rating,
    content: v.content.trim(),
  });
  await sync(v.hotel);
  return review;
}
export const listReviews = (hotel) => reviewRepository.findByHotel(hotel);
export async function deleteReview(u, id) {
  const review = await reviewRepository.removeOwned(u, id);
  if (!review) throw new ApiError(404, "삭제할 수 있는 후기가 없습니다.");
  await sync(review.hotel);
  return review;
}
