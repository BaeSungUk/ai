import {
  createReview as createReviewRepository,
  deleteReviewById,
  findReviewById,
  findReviewByReservation,
  findReviewsByHotel,
} from "../repository/reviewRepository.js";

import { findHotelById } from "../repository/hotelRepository.js";

import { findReservationById } from "../repository/reservationRepository.js";

import AppError from "../util/AppError.js";

export const createReview = async (hotelId, data, userId) => {
  const { reservationId, rating, comment } = data;

  if (!reservationId || rating === undefined || !comment) {
    throw new AppError("후기 필수 정보를 입력해주세요.", 400);
  }

  const hotel = await findHotelById(hotelId);

  if (!hotel) {
    throw new AppError("존재하지 않는 호텔입니다.", 404);
  }

  const reservation = await findReservationById(reservationId);

  if (!reservation) {
    throw new AppError("예약 정보를 찾을 수 없습니다.", 404);
  }

  if (reservation.user.toString() !== userId.toString()) {
    throw new AppError(
      "본인이 예약한 호텔에만 후기를 작성할 수 있습니다.",
      403,
    );
  }

  if (reservation.hotel.toString() !== hotelId.toString()) {
    throw new AppError("해당 호텔의 예약 정보가 아닙니다.", 400);
  }

  if (reservation.status === "cancelled") {
    throw new AppError("취소된 예약에는 후기를 작성할 수 없습니다.", 400);
  }

  const existReview = await findReviewByReservation(reservationId);

  if (existReview) {
    throw new AppError("이미 작성한 예약 후기입니다.", 409);
  }

  const reviewRating = Number(rating);

  if (!Number.isInteger(reviewRating) || reviewRating < 1 || reviewRating > 5) {
    throw new AppError("별점은 1점에서 5점 사이여야 합니다.", 400);
  }

  return createReviewRepository({
    user: userId,
    hotel: hotelId,
    reservation: reservationId,
    rating: reviewRating,
    comment: comment.trim(),
  });
};

export const getReviews = async (hotelId) => {
  const hotel = await findHotelById(hotelId);

  if (!hotel) {
    throw new AppError("존재하지 않는 호텔입니다.", 404);
  }

  return findReviewsByHotel(hotelId);
};

export const deleteReview = async (reviewId, userId) => {
  const review = await findReviewById(reviewId);

  if (!review) {
    throw new AppError("존재하지 않는 후기입니다.", 404);
  }

  if (review.user.toString() !== userId.toString()) {
    throw new AppError("후기 작성자만 삭제할 수 있습니다.", 403);
  }

  await deleteReviewById(reviewId);

  return null;
};
