import api from "./axios.js";

export const getReviews = async (hotelId) => {
  const response = await api.get(`/hotels/${hotelId}/reviews`);

  return response.data;
};

export const createReview = async (hotelId, reviewData) => {
  const response = await api.post(`/hotels/${hotelId}/reviews`, reviewData);

  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);

  return response.data;
};
