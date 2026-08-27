import {
  createHotel as createHotelRepository,
  findHotelById,
  findHotels,
  findHotelsByOwner,
  deleteHotelById
} from "../repository/hotelRepository.js";
import { deleteRoomsByHotel } from "../repository/roomRepository.js";
import { deleteReservationsByHotel } from "../repository/reservationRepository.js";
import { deleteReviewsByHotel } from "../repository/reviewRepository.js";
import AppError from "../util/AppError.js";

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const createHotel = async (data, userId) => {
  const { hotelName, region, address, description, price, image } = data;

  if (
    !hotelName ||
    !region ||
    !address ||
    !description ||
    price === undefined
  ) {
    throw new AppError("호텔 필수 정보를 입력해주세요.", 400);
  }

  if (Number.isNaN(Number(price)) || Number(price) < 0) {
    throw new AppError("호텔 가격이 올바르지 않습니다.", 400);
  }

  return createHotelRepository({
    hotelName: hotelName.trim(),
    region: region.trim(),
    address: address.trim(),
    description: description.trim(),
    price: Number(price),
    image: image || "",
    createdBy: userId,
  });
};

export const getHotels = async ({ region, name, sort }) => {
  const filter = {};

  if (region) {
    filter.region = {
      $regex: escapeRegex(region),
      $options: "i",
    };
  }

  if (name) {
    filter.hotelName = {
      $regex: escapeRegex(name),
      $options: "i",
    };
  }

  // 먼저 선언
  let sortOption = {
    createdAt: -1,
  };

  if (sort === "priceAsc") {
    sortOption = {
      price: 1,
    };
  }

  if (sort === "priceDesc") {
    sortOption = {
      price: -1,
    };
  }

  if (sort === "ratingDesc") {
    sortOption = {
      averageRating: -1,
    };
  }

  return findHotels(filter, sortOption);
};

export const getHotelDetail = async (hotelId) => {
  const hotel = await findHotelById(hotelId);

  if (!hotel) {
    throw new AppError("존재하지 않는 호텔입니다.", 404);
  }

  return hotel;
};

export const updateHotel = async (hotelId, data, userId) => {
  const hotel = await findHotelById(hotelId);

  if (!hotel) {
    throw new AppError("존재하지 않는 호텔입니다.", 404);
  }

  if (hotel.createdBy.toString() !== userId.toString()) {
    throw new AppError("호텔 작성자만 수정할 수 있습니다.", 403);
  }

  const allowedFields = [
    "hotelName",
    "region",
    "address",
    "description",
    "price",
    "image",
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      hotel[field] = data[field];
    }
  }

  if (hotel.price < 0) {
    throw new AppError("호텔 가격이 올바르지 않습니다.", 400);
  }

  await hotel.save();

  return hotel;
};

export const deleteHotel = async (hotelId, userId) => {
  const hotel = await findHotelById(hotelId);

  if (!hotel) {
    throw new AppError("존재하지 않는 호텔입니다.", 404);
  }

  if (hotel.createdBy.toString() !== userId.toString()) {
    throw new AppError("호텔 작성자만 삭제할 수 있습니다.", 403);
  }

  await Promise.all([
    deleteRoomsByHotel(hotelId),
    deleteReservationsByHotel(hotelId),
    deleteReviewsByHotel(hotelId),
  ]);

  await deleteHotelById(hotelId);

  return null;
};

export const getMyHotels = async (userId) => {
  return await findHotelsByOwner(userId);
};
