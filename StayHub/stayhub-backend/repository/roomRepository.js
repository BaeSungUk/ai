import Room from "../model/Room.js";

export const createRoom = async (roomData) => {
  return Room.create(roomData);
};

export const findRoomsByHotel = async (hotelId) => {
  return Room.find({
    hotel: hotelId,
  }).sort({
    price: 1,
  });
};

export const findRoomById = async (roomId) => {
  return Room.findById(roomId);
};

export const incrementRoomReservationVersion = async (roomId, session) => {
  return Room.findByIdAndUpdate(
    roomId,
    {
      $inc: {
        reservationVersion: 1,
      },
    },
    {
      new: true,
      session,
    },
  );
};

export const findRoomDetailById = async (roomId) => {
  return Room.findById(roomId).populate("hotel", "hotelName region address");
};

export const deleteRoomById = async (roomId) => {
  return Room.findByIdAndDelete(roomId);
};

export const deleteRoomsByHotel = async (hotelId) => {
  return Room.deleteMany({
    hotel: hotelId,
  });
};
