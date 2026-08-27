import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../model/User.js";
import Hotel from "../model/Hotel.js";
import Room from "../model/Room.js";

dotenv.config();


// ==============================
// 호텔 테스트 데이터
// ==============================

const hotelSeeds = [
  {
    hotelName: "StayHub 서울 시티 호텔",
    region: "서울",
    address: "서울특별시 중구 세종대로 100",
    description:
      "서울 중심에서 편안하게 머물 수 있는 도심형 호텔입니다.",
    price: 90000,
    image: "/images/hotels/seoul-city.png"
  },
  {
    hotelName: "StayHub 부산 오션 호텔",
    region: "부산",
    address: "부산광역시 해운대구 해운대로 200",
    description:
      "해운대 바다와 가까운 오션뷰 호텔입니다.",
    price: 110000,
    image: "/images/hotels/busan-ocean.png"
  },
  {
    hotelName: "StayHub 제주 하늘 호텔",
    region: "제주",
    address: "제주특별자치도 제주시 애월읍 애월로 50",
    description:
      "제주의 자연과 여유를 즐길 수 있는 호텔입니다.",
    price: 120000,
    image: "/images/hotels/jeju-resort.png"
  },
  {
    hotelName: "StayHub 강릉 씨뷰 호텔",
    region: "강릉",
    address: "강원특별자치도 강릉시 창해로 300",
    description:
      "강릉 바다를 가까이에서 즐길 수 있는 호텔입니다.",
    price: 100000,
    image: "/images/hotels/gangneung-seaview.png"
  },
  {
    hotelName: "StayHub 경주 한옥 스테이",
    region: "경주",
    address: "경상북도 경주시 황남동 100",
    description:
      "경주의 전통적인 분위기를 느낄 수 있는 숙소입니다.",
    price: 85000,
    image: "/images/hotels/gyeongju-hanok.png"
  },
  {
    hotelName: "StayHub 인천 에어포트 호텔",
    region: "인천",
    address: "인천광역시 중구 공항로 150",
    description:
      "인천공항과 가까워 여행 전후 이용하기 좋은 호텔입니다.",
    price: 80000,
    image: "/images/hotels/incheon-airport.png"
  },
  {
    hotelName: "StayHub 여수 마리나 호텔",
    region: "여수",
    address: "전라남도 여수시 돌산읍 강남로 70",
    description:
      "여수 밤바다와 함께 휴식을 즐길 수 있는 호텔입니다.",
    price: 105000,
    image: "/images/hotels/yeosu-marina.png"
  },
  {
    hotelName: "StayHub 속초 비치 호텔",
    region: "속초",
    address: "강원특별자치도 속초시 해오름로 120",
    description:
      "속초 해변과 가까운 휴양형 호텔입니다.",
    price: 95000,
    image: "/images/hotels/sokcho-beach.png"
  },
  {
    hotelName: "StayHub 전주 한옥 호텔",
    region: "전주",
    address: "전북특별자치도 전주시 완산구 한지길 80",
    description:
      "전주 한옥마을을 편하게 즐길 수 있는 숙소입니다.",
    price: 75000,
    image: "/images/hotels/jeonju-hanok.png"
  },
  {
    hotelName: "StayHub 대전 시티 호텔",
    region: "대전",
    address: "대전광역시 서구 둔산로 90",
    description:
      "대전 도심 접근성이 좋은 비즈니스 호텔입니다.",
    price: 70000,
    image: "/images/hotels/daejeon-city.png"
  }
];


// ==============================
// 객실 3종류
// ==============================

const roomTemplates = [
  {
    roomName: "스탠다드룸",
    priceOffset: 0,
    maxGuests: 2,
    description:
      "2인이 편안하게 이용할 수 있는 기본 객실입니다.",
    image: "/images/rooms/standard.png"
  },
  {
    roomName: "디럭스룸",
    priceOffset: 50000,
    maxGuests: 3,
    description:
      "넓은 공간과 편안한 시설을 갖춘 디럭스 객실입니다.",
    image: "/images/rooms/deluxe.png"
  },
  {
    roomName: "스위트룸",
    priceOffset: 120000,
    maxGuests: 4,
    description:
      "넓은 공간과 고급 시설을 갖춘 프리미엄 객실입니다.",
    image: "/images/rooms/suite.png"
  }
];


// ==============================
// Seed 실행
// ==============================

const seed = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect(
      process.env.DB_HOST,
      {
        dbName: process.env.DB_NAME
      }
    );

    console.log("MongoDB 연결 완료");


    // --------------------------
    // 호텔 작성자 찾기
    // --------------------------

    let owner;

    // .env에 SEED_OWNER_USERID가 있으면
    // 해당 사용자를 우선 사용
    if (process.env.SEED_OWNER_USERID) {
      owner = await User.findOne({
        userid:
          process.env.SEED_OWNER_USERID
      });
    }

    // 없으면 DB의 첫 번째 사용자 사용
    if (!owner) {
      owner = await User.findOne();
    }


    if (!owner) {
      throw new Error(
        "등록된 사용자가 없습니다. 먼저 회원가입을 해주세요."
      );
    }


    console.log(
      `호텔 작성자: ${owner.userid}`
    );


    let hotelCount = 0;
    let roomCount = 0;


    // ==========================
    // 호텔 생성
    // ==========================

    for (const hotelData of hotelSeeds) {

      // 같은 호텔이 이미 있는지 확인
      let hotel = await Hotel.findOne({
        hotelName:
          hotelData.hotelName,
        address:
          hotelData.address
      });


      // 없으면 새로 생성
      if (!hotel) {

        hotel = await Hotel.create({
          ...hotelData,

          createdBy:
            owner._id
        });

        hotelCount++;

        console.log(
          `호텔 생성: ${hotel.hotelName}`
        );

      } else {

        hotel.image =
          hotelData.image;

        await hotel.save();

        console.log(
          `호텔 이미지 갱신: ${hotel.hotelName}`
        );
      }


      // ==========================
      // 객실 3개 생성
      // ==========================

      for (
        const roomTemplate
        of roomTemplates
      ) {

        const existingRoom =
          await Room.findOne({
            hotel:
              hotel._id,

            roomName:
              roomTemplate.roomName
          });


        // 이미 있으면 중복 생성 안 함
        if (existingRoom) {
          existingRoom.image =
            roomTemplate.image;

          await existingRoom.save();

          console.log(
            `  └ 객실 이미지 갱신: ${roomTemplate.roomName}`
          );

          continue;
        }


        await Room.create({
          hotel:
            hotel._id,

          roomName:
            roomTemplate.roomName,

          price:
            hotelData.price +
            roomTemplate.priceOffset,

          maxGuests:
            roomTemplate.maxGuests,

          description:
            roomTemplate.description,

          image:
            roomTemplate.image,

          createdBy:
            owner._id
        });


        roomCount++;


        console.log(
          `  └ 객실 생성: ${roomTemplate.roomName}`
        );
      }
    }


    console.log("");
    console.log("==============================");
    console.log("Seed 완료");
    console.log(
      `새로 생성된 호텔: ${hotelCount}개`
    );
    console.log(
      `새로 생성된 객실: ${roomCount}개`
    );
    console.log("==============================");

  } catch (error) {

    console.error(
      "Seed 오류:",
      error
    );

  } finally {

    await mongoose.disconnect();

    console.log(
      "MongoDB 연결 종료"
    );
  }
};


seed();
