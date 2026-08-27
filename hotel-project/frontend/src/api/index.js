import api from "./axiosInstance.js";
const data = (p) => p.then((r) => r.data.data);
export const authApi = {
  signup: (v) => data(api.post("/auth/signup", v)),
  login: (v) => data(api.post("/auth/login", v)),
  checkEmail: (e) =>
    data(api.get("/auth/check-email", { params: { email: e } })),
};
export const hotelApi = {
  list: (p) => data(api.get("/hotels", { params: p })),
  get: (id) => data(api.get(`/hotels/${id}`)),
  rooms: (id, params) => data(api.get(`/hotels/${id}/rooms`, { params })),
};
export const reservationApi = {
  create: (v) => data(api.post("/reservations", v)),
  list: () => data(api.get("/reservations")),
  get: (id) => data(api.get(`/reservations/${id}`)),
  cancel: (id) => data(api.patch(`/reservations/${id}/cancel`)),
};
export const reviewApi = {
  list: (id) => data(api.get(`/hotels/${id}/reviews`)),
  create: (v) => data(api.post("/reviews", v)),
  remove: (id) => data(api.delete(`/reviews/${id}`)),
};
