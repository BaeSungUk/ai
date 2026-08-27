const img = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
export const hotels = [
  {
    key: "stayhub-seoul",
    name: "StayHub Seoul",
    location: "서울",
    address: "서울특별시 중구 세종대로 110",
    description: "서울의 중심에서 만나는 차분하고 세련된 도심 휴식처입니다.",
    images: [img("photo-1566073771259-6a8506099945")],
    amenities: ["무료 Wi-Fi", "피트니스", "조식"],
    rooms: [
      ["디럭스 킹", 145000, 2],
      ["패밀리 스위트", 245000, 4],
      ["시티 트윈", 175000, 2],
    ],
  },
  {
    key: "han-river",
    name: "Han River Hotel",
    location: "서울",
    address: "서울특별시 영등포구 여의대로 24",
    description: "한강 전망과 여유로운 라운지를 갖춘 리버사이드 호텔입니다.",
    images: [img("photo-1571896349842-33c89424de2d")],
    amenities: ["한강 전망", "라운지", "주차"],
    rooms: [
      ["리버 더블", 165000, 2],
      ["파노라마 스위트", 320000, 3],
    ],
  },
  {
    key: "ocean-busan",
    name: "Ocean Stay Busan",
    location: "부산",
    address: "부산광역시 해운대구 해운대해변로 264",
    description: "파도 소리와 함께 잠드는 해운대 오션 프런트 스테이입니다.",
    images: [img("photo-1582719478250-c89cae4dc85b")],
    amenities: ["오션뷰", "수영장", "루프톱"],
    rooms: [
      ["오션 킹", 190000, 2],
      ["패밀리 오션", 280000, 4],
      ["코너 스위트", 350000, 3],
    ],
  },
  {
    key: "jeju-breeze",
    name: "Jeju Breeze Resort",
    location: "제주",
    address: "제주특별자치도 서귀포시 중문관광로 72",
    description: "제주의 바람과 정원을 품은 편안한 휴양 리조트입니다.",
    images: [img("photo-1600607687920-4e2a09cf159d")],
    amenities: ["정원", "스파", "무료 주차"],
    rooms: [
      ["가든 룸", 135000, 2],
      ["브리즈 빌라", 295000, 4],
      ["패밀리 온돌", 210000, 5],
    ],
  },
];
