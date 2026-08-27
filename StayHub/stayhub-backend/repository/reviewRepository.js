import Review from "../model/Review.js";

export const createReview = async (reviewData) => {
  return Review.create(reviewData);
};

export const findReviewsByHotel = async (hotelId) => {
  return Review.find({
    hotel: hotelId,
  })
    .sort({
      createdAt: -1,
    })
    .populate("user", "userid nickname");
};

export const findReviewById = async (reviewId) => {
  return Review.findById(reviewId);
};

export const findReviewByReservation = async (reservationId) => {
  return Review.findOne({
    reservation: reservationId,
  });
};

export const deleteReviewById = async (reviewId) => {
  return Review.findByIdAndDelete(reviewId);
};

export const deleteReviewsByHotel = async (hotelId) => {
  return Review.deleteMany({
    hotel: hotelId,
  });
};
