import Hotel from "../model/Hotel.js";

export const createHotel = async (hotelData) => {
  return Hotel.create(hotelData);
};

export const findHotels = async (filter, sort) => {
  return Hotel.aggregate([
    {
      $match: filter,
    },

    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "hotel",
        as: "reviews",
      },
    },

    {
      $addFields: {
        averageRating: {
          $ifNull: [
            {
              $avg: "$reviews.rating",
            },
            0,
          ],
        },

        reviewCount: {
          $size: "$reviews",
        },
      },
    },

    {
      $project: {
        reviews: 0,
      },
    },

    {
      $sort: sort,
    },
  ]);
};

export const findHotelById = async (hotelId) => {
  return Hotel.findById(hotelId);
};

export const findHotelDetailById = async (hotelId) => {
  return Hotel.findById(hotelId).populate("createdBy", "userid nickname");
};

export const deleteHotelById = async (hotelId) => {
  return Hotel.findByIdAndDelete(hotelId);
};

export const findHotelsByOwner = async (userId) => {
  return Hotel.aggregate([
    {
      $match: {
        createdBy: userId,
      },
    },

    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "hotel",
        as: "reviews",
      },
    },

    {
      $addFields: {
        averageRating: {
          $ifNull: [
            {
              $avg: "$reviews.rating",
            },
            0,
          ],
        },

        reviewCount: {
          $size: "$reviews",
        },
      },
    },

    {
      $project: {
        reviews: 0,
      },
    },

    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);
};
