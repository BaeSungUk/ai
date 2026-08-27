import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "../model/User.js";
import Hotel from "../model/Hotel.js";
import Room from "../model/Room.js";
import Reservation from "../model/Reservation.js";
import Review from "../model/Review.js";

dotenv.config();


// ======================================================
// 기본 설정
// ======================================================

const REGIONS = [
  "서울",
  "부산",
  "제주",
  "인천",
  "강릉",
  "경주",
  "여수",
  "속초",
  "전주",
  "대전"
];

const HOTEL_IMAGES = {
  서울: "/images/hotels/seoul-city.png",
  부산: "/images/hotels/busan-ocean.png",
  제주: "/images/hotels/jeju-resort.png",
  인천: "/images/hotels/incheon-airport.png",
  강릉: "/images/hotels/gangneung-seaview.png",
  경주: "/images/hotels/gyeongju-hanok.png",
  여수: "/images/hotels/yeosu-marina.png",
  속초: "/images/hotels/sokcho-beach.png",
  전주: "/images/hotels/jeonju-hanok.png",
  대전: "/images/hotels/daejeon-city.png"
};


const HOTEL_TYPES = [
  "시티 호텔",
  "센트럴 호텔",
  "그랜드 호텔",
  "프리미엄 호텔",
  "스테이 호텔"
];


const ROOM_TEMPLATES = [
  {
    roomName: "스탠다드룸",
    maxGuests: 2,
    priceOffset: 0,
    description:
      "깔끔하고 편안한 기본 객실입니다.",
    image: "/images/rooms/standard.png"
  },
  {
    roomName: "슈페리어룸",
    maxGuests: 2,
    priceOffset: 20000,
    description:
      "여유로운 공간을 제공하는 객실입니다.",
    image: "/images/rooms/superior.png"
  },
  {
    roomName: "디럭스룸",
    maxGuests: 3,
    priceOffset: 40000,
    description:
      "넓은 공간과 편안한 시설을 갖춘 객실입니다.",
    image: "/images/rooms/deluxe.png"
  },
  {
    roomName: "패밀리룸",
    maxGuests: 4,
    priceOffset: 70000,
    description:
      "가족 단위 여행객에게 적합한 넓은 객실입니다.",
    image: "/images/rooms/family.png"
  },
  {
    roomName: "스위트룸",
    maxGuests: 4,
    priceOffset: 120000,
    description:
      "넓은 공간과 고급 시설을 갖춘 프리미엄 객실입니다.",
    image: "/images/rooms/suite.png"
  }
];


const REVIEW_COMMENTS = [
  "객실이 깔끔하고 편안했습니다.",
  "직원분들이 친절해서 좋았습니다.",
  "위치가 좋아서 이동하기 편했습니다.",
  "가격 대비 만족도가 높았습니다.",
  "객실이 생각보다 넓고 좋았습니다.",
  "조용하게 쉬기 좋은 숙소였습니다.",
  "다음에도 다시 이용하고 싶습니다.",
  "전반적으로 만족스러운 숙박이었습니다.",
  "시설이 깨끗하고 관리가 잘 되어 있었습니다.",
  "주변에 식당과 편의시설이 많아서 좋았습니다.",
  "침구가 편안해서 잘 쉬었습니다.",
  "체크인 과정이 편리했습니다."
];


// ======================================================
// 공통 함수
// ======================================================

const randomInt = (
  min,
  max
) => {
  return Math.floor(
    Math.random() *
      (max - min + 1)
  ) + min;
};


const randomItem = (
  array
) => {
  return array[
    randomInt(
      0,
      array.length - 1
    )
  ];
};


const randomPrice = (
  min,
  max,
  unit = 10000
) => {
  const count =
    Math.floor(
      (max - min) /
        unit
    );

  return (
    min +
    randomInt(
      0,
      count
    ) *
      unit
  );
};


const addDays = (
  date,
  days
) => {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() +
      days
  );

  return result;
};


const startOfToday = () => {
  const date =
    new Date();

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date;
};


const setTime = (
  date,
  hour
) => {
  const result =
    new Date(date);

  result.setHours(
    hour,
    0,
    0,
    0
  );

  return result;
};


const calculateNights = (
  checkIn,
  checkOut
) => {
  const difference =
    checkOut.getTime() -
    checkIn.getTime();

  return Math.ceil(
    difference /
      (
        1000 *
        60 *
        60 *
        24
      )
  );
};


// ======================================================
// 사용자 생성
// ======================================================

const createUsers =
  async () => {

    const saltRounds =
      Number(
        process.env
          .BCRYPT_SALT_ROUNDS ||
          10
      );

    const users = [];


    for (
      let i = 1;
      i <= 10;
      i++
    ) {

      // 테스트 계정이므로
      // 비밀번호는 모두 1111
      const hashedPassword =
        await bcrypt.hash(
          "1111",
          saltRounds
        );


      users.push({
        userid:
          `user${i}`,

        userpw:
          hashedPassword,

        username:
          `사용자${i}`,

        nickname:
          `유저${i}`,

        email:
          `user${i}@test.com`,

        role: "user"
      });
    }


    return await User.insertMany(
      users
    );
  };


// ======================================================
// 호텔 생성
// ======================================================

const createHotels = async (
  users
) => {

  const hotels = [];

  let ownerIndex = 0;


  for (
    const region
    of REGIONS
  ) {

    for (
      let i = 0;
      i < 5;
      i++
    ) {

      const owner =
        users[
          ownerIndex %
            users.length
        ];


      const basePrice =
        randomPrice(
          70000,
          180000
        );


      hotels.push({
        hotelName:
          `StayHub ${region} ${HOTEL_TYPES[i]}`,

        region,

        address:
          `${region} 테스트구 StayHub길 ${
            (i + 1) * 10
          }`,

        description:
          `${region} 여행을 편안하게 즐길 수 있는 StayHub 숙소입니다.`,

        price:
          basePrice,

        image: HOTEL_IMAGES[region],

        createdBy:
          owner._id
      });


      ownerIndex++;
    }
  }


  return await Hotel.insertMany(
    hotels
  );
};


// ======================================================
// 객실 생성
// ======================================================

const createRooms = async (
  hotels
) => {

    const rooms = [];


    for (
      const hotel
      of hotels
    ) {

      // 호텔마다 3~5개
      const roomCount =
        randomInt(
          3,
          5
        );


      for (
        let i = 0;
        i < roomCount;
        i++
      ) {

        const template =
          ROOM_TEMPLATES[i];


        rooms.push({
          hotel:
            hotel._id,

          roomName:
            template.roomName,

          price:
            hotel.price +
            template.priceOffset,

          maxGuests:
            template.maxGuests,

          description:
            template.description,

          image:
            template.image,

          createdBy:
            hotel.createdBy
        });
      }
    }


    return await Room.insertMany(
      rooms
    );
};


// ======================================================
// 예약 데이터 생성
// ======================================================

const createReservations =
  async (
    users,
    hotels,
    rooms
  ) => {

    const reservations = [];

    const today =
      startOfToday();


    for (
      const room
      of rooms
    ) {

      const hotel =
        hotels.find(
          (hotel) =>
            hotel._id.toString() ===
            room.hotel.toString()
        );


      if (!hotel) {
        continue;
      }


      // 방마다 1~3개 예약 생성
      const count =
        randomInt(
          1,
          3
        );


      // ----------------------------------
      // 1. 과거 예약
      // checkedOut 또는 cancelled
      // ----------------------------------

      if (count >= 1) {

        const user =
          randomItem(
            users
          );

        const checkIn =
          addDays(
            today,
            -randomInt(
              10,
              40
            )
          );

        const nights =
          randomInt(
            1,
            4
          );

        const checkOut =
          addDays(
            checkIn,
            nights
          );


        const cancelled =
          Math.random() <
          0.2;


        reservations.push({
          user:
            user._id,

          hotel:
            hotel._id,

          room:
            room._id,

          checkInDate:
            checkIn,

          checkOutDate:
            checkOut,

          guestCount:
            randomInt(
              1,
              room.maxGuests
            ),

          totalPrice:
            room.price *
            nights,

          status:
            cancelled
              ? "cancelled"
              : "checkedOut",

          actualCheckInAt:
            cancelled
              ? null
              : setTime(
                  checkIn,
                  15
                ),

          actualCheckOutAt:
            cancelled
              ? null
              : setTime(
                  checkOut,
                  11
                )
        });
      }


      // ----------------------------------
      // 2. 현재 체크인 중
      // checkedIn
      // ----------------------------------

      if (
        count >= 2 &&
        Math.random() <
          0.6
      ) {

        const user =
          randomItem(
            users
          );


        // 어제 또는 오늘 체크인
        const checkIn =
          addDays(
            today,
            -randomInt(
              0,
              1
            )
          );


        // 내일~3일 뒤 체크아웃
        const checkOut =
          addDays(
            today,
            randomInt(
              1,
              3
            )
          );


        const nights =
          calculateNights(
            checkIn,
            checkOut
          );


        reservations.push({
          user:
            user._id,

          hotel:
            hotel._id,

          room:
            room._id,

          checkInDate:
            checkIn,

          checkOutDate:
            checkOut,

          guestCount:
            randomInt(
              1,
              room.maxGuests
            ),

          totalPrice:
            room.price *
            nights,

          status:
            "checkedIn",

          actualCheckInAt:
            setTime(
              checkIn,
              15
            ),

          actualCheckOutAt:
            null
        });
      }


      // ----------------------------------
      // 3. 미래 예약
      // confirmed 또는 cancelled
      // ----------------------------------

      if (count >= 2) {

        const user =
          randomItem(
            users
          );


        const checkIn =
          addDays(
            today,
            randomInt(
              7,
              45
            )
          );


        const nights =
          randomInt(
            1,
            4
          );


        const checkOut =
          addDays(
            checkIn,
            nights
          );


        const cancelled =
          Math.random() <
          0.2;


        reservations.push({
          user:
            user._id,

          hotel:
            hotel._id,

          room:
            room._id,

          checkInDate:
            checkIn,

          checkOutDate:
            checkOut,

          guestCount:
            randomInt(
              1,
              room.maxGuests
            ),

          totalPrice:
            room.price *
            nights,

          status:
            cancelled
              ? "cancelled"
              : "confirmed",

          actualCheckInAt:
            null,

          actualCheckOutAt:
            null
        });
      }
    }


    return await Reservation.insertMany(
      reservations
    );
  };


// ======================================================
// 후기 생성
// ======================================================

const createReviews = async (
  reservations
) => {

  const reviews = [];


  for (
    const reservation
    of reservations
  ) {

    // 실제 숙박 경험이 있는 상태만
    if (
      ![
        "checkedIn",
        "checkedOut"
      ].includes(
        reservation.status
      )
    ) {
      continue;
    }


    // 약 65%만 후기 작성
    if (
      Math.random() >
      0.65
    ) {
      continue;
    }


    reviews.push({
      user:
        reservation.user,

      hotel:
        reservation.hotel,

      reservation:
        reservation._id,

      rating:
        randomInt(
          1,
          5
        ),

      comment:
        randomItem(
          REVIEW_COMMENTS
        )
    });
  }


  return await Review.insertMany(
    reviews
  );
};


// ======================================================
// MAIN
// ======================================================

const seedAll =
  async () => {

    try {

      console.log(
        "=============================="
      );

      console.log(
        "StayHub Seed 시작"
      );

      console.log(
        "=============================="
      );


      await mongoose.connect(
        process.env.DB_HOST,
        {
          dbName:
            process.env.DB_NAME
        }
      );


      console.log(
        `MongoDB 연결: ${process.env.DB_NAME}`
      );


      // ==================================
      // 기존 데이터 삭제
      // ==================================

      console.log(
        "\n기존 데이터 삭제 중..."
      );


      await Review.deleteMany(
        {}
      );

      await Reservation.deleteMany(
        {}
      );

      await Room.deleteMany(
        {}
      );

      await Hotel.deleteMany(
        {}
      );

      await User.deleteMany(
        {}
      );


      console.log(
        "기존 데이터 삭제 완료"
      );


      // ==================================
      // 사용자
      // ==================================

      console.log(
        "\n사용자 생성 중..."
      );


      const users =
        await createUsers();


      console.log(
        `사용자 ${users.length}명 생성`
      );


      // ==================================
      // 호텔
      // ==================================

      console.log(
        "\n호텔 생성 중..."
      );


      const hotels =
        await createHotels(
          users
        );


      console.log(
        `호텔 ${hotels.length}개 생성`
      );


      // ==================================
      // 객실
      // ==================================

      console.log(
        "\n객실 생성 중..."
      );


      const rooms =
        await createRooms(
          hotels
        );


      console.log(
        `객실 ${rooms.length}개 생성`
      );


      // ==================================
      // 예약
      // ==================================

      console.log(
        "\n예약 생성 중..."
      );


      const reservations =
        await createReservations(
          users,
          hotels,
          rooms
        );


      console.log(
        `예약 ${reservations.length}개 생성`
      );


      // ==================================
      // 후기
      // ==================================

      console.log(
        "\n후기 생성 중..."
      );


      const reviews =
        await createReviews(
          reservations
        );


      console.log(
        `후기 ${reviews.length}개 생성`
      );


      // ==================================
      // 상태 통계
      // ==================================

      const statusCount = {
        confirmed: 0,
        checkedIn: 0,
        checkedOut: 0,
        cancelled: 0
      };


      reservations.forEach(
        (reservation) => {

          if (
            statusCount[
              reservation.status
            ] !== undefined
          ) {

            statusCount[
              reservation.status
            ]++;
          }
        }
      );


      console.log(
        "\n=============================="
      );

      console.log(
        "StayHub Seed 완료!"
      );

      console.log(
        "=============================="
      );

      console.log(
        `사용자: ${users.length}명`
      );

      console.log(
        `호텔: ${hotels.length}개`
      );

      console.log(
        `객실: ${rooms.length}개`
      );

      console.log(
        `예약: ${reservations.length}개`
      );

      console.log(
        `후기: ${reviews.length}개`
      );


      console.log(
        "\n예약 상태"
      );

      console.log(
        `예약 완료: ${statusCount.confirmed}`
      );

      console.log(
        `체크인: ${statusCount.checkedIn}`
      );

      console.log(
        `체크아웃: ${statusCount.checkedOut}`
      );

      console.log(
        `취소: ${statusCount.cancelled}`
      );


      console.log(
        "\n테스트 로그인 계정"
      );

      console.log(
        "user1 ~ user10"
      );

      console.log(
        "비밀번호: 1111"
      );


    } catch (error) {

      console.error(
        "\nSeed 실행 실패"
      );

      console.error(
        error
      );

      process.exitCode = 1;

    } finally {

      await mongoose.disconnect();

      console.log(
        "\nMongoDB 연결 종료"
      );
    }
  };


seedAll();
