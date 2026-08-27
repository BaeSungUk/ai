import Reservation from "../model/Reservation.js";

export const createReservation = async (reservationData, session) => {
  if (session) {
    const [reservation] = await Reservation.create([reservationData], {
      session,
    });

    return reservation;
  }

  return Reservation.create(reservationData);
};

export const findOverlappingReservation = async (
  roomId,
  checkInDate,
  checkOutDate,
  session,
) => {
  const query = Reservation.findOne({
    room: roomId,

    status: {
      $in: ["confirmed", "checkedIn"],
    },

    checkInDate: {
      $lt: checkOutDate,
    },

    checkOutDate: {
      $gt: checkInDate,
    },
  });

  if (session) {
    query.session(session);
  }

  return query;
};

export const findReservationsByUser = async (userId) => {
  return Reservation.find({
    user: userId,
  })
    .sort({
      createdAt: -1,
    })
    .populate("hotel", "hotelName region address")
    .populate("room", "roomName price maxGuests");
};

export const findReservationById = async (reservationId) => {
  return Reservation.findById(reservationId);
};

export const findReservationDetailById = async (reservationId) => {
  return Reservation.findById(reservationId)
    .populate("hotel", "hotelName region address")
    .populate("room", "roomName price maxGuests");
};

export const existsConfirmedReservationByRoom = async (roomId) => {
  return Reservation.exists({
    room: roomId,
    status: "confirmed",
  });
};

export const deleteReservationsByHotel = async (hotelId) => {
  return Reservation.deleteMany({
    hotel: hotelId,
  });
};
