import api from "./axios.js";

// 객실 상세
export const getRoomDetail = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}`);

  return response.data;
};

// 객실 등록
export const createRoom = async (hotelId, roomData) => {
  const response = await api.post(`/hotels/${hotelId}/rooms`, roomData);

  return response.data;
};

// 객실 수정
export const updateRoom = async (roomId, roomData) => {
  const response = await api.patch(`/rooms/${roomId}`, roomData);

  return response.data;
};

// 객실 삭제
export const deleteRoom = async (roomId) => {
  const response = await api.delete(`/rooms/${roomId}`);

  return response.data;
};

// 객실 예약 가능 여부
export const getRoomAvailability = async (
  roomId,
  checkInDate,
  checkOutDate,
) => {
  const response = await api.get(`/rooms/${roomId}/availability`, {
    params: {
      checkInDate,
      checkOutDate,
    },
  });

  return response.data;
};
