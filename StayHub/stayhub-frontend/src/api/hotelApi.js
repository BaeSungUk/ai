import api from "./axios.js";

export const getHotels = async (params = {}) => {
  const response = await api.get("/hotels", {
    params,
  });

  return response.data;
};

export const getMyHotels = async () => {
  const response = await api.get("/hotels/me");

  return response.data;
};

export const getHotelDetail = async (hotelId) => {
  const response = await api.get(`/hotels/${hotelId}`);

  return response.data;
};

export const getRooms = async (hotelId) => {
  const response = await api.get(`/hotels/${hotelId}/rooms`);

  return response.data;
};

// 호텔 등록
export const createHotel = async (hotelData) => {
  const response = await api.post("/hotels", hotelData);

  return response.data;
};

// 호텔 수정
export const updateHotel = async (hotelId, hotelData) => {
  const response = await api.patch(`/hotels/${hotelId}`, hotelData);

  return response.data;
};

// 호텔 삭제
export const deleteHotel = async (hotelId) => {
  const response = await api.delete(`/hotels/${hotelId}`);

  return response.data;
};
