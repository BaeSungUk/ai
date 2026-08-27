import api from "./axios.js";

export const createReservation = async (data) => {
  const response = await api.post("/reservations", data);

  return response.data;
};

export const getReservations = async () => {
  const response = await api.get("/reservations");

  return response.data;
};

export const getReservationDetail = async (reservationId) => {
  const response = await api.get(`/reservations/${reservationId}`);

  return response.data;
};

export const cancelReservation = async (reservationId) => {
  const response = await api.patch(`/reservations/${reservationId}/cancel`);

  return response.data;
};

export const checkInReservation = async (reservationId) => {
  const response = await api.patch(`/reservations/${reservationId}/check-in`);

  return response.data;
};

export const checkOutReservation = async (reservationId) => {
  const response = await api.patch(`/reservations/${reservationId}/check-out`);

  return response.data;
};
