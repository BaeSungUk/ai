import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelApi } from "../api/index.js";
import { HotelCard, Message } from "../components.jsx";
export default function HomePage() {
  const [location, setLocation] = useState(""),
    [name, setName] = useState(""),
    nav = useNavigate(),
    [hotels, setHotels] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    hotelApi.list({ sort: "ratingDesc" })
      .then((rows) => setHotels(rows.slice(0, 3)))
      .catch(() => setError("추천 호텔을 불러오지 못했습니다. Backend와 MongoDB 실행 상태를 확인해 주세요."))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">STAYHUB COLLECTION</span>
          <h1>
            당신에게 꼭 맞는
            <br />
            숙소를 찾아보세요.
          </h1>
          <p>
            도심의 하루부터 바다 앞 휴식까지, 믿을 수 있는 숙소를 한곳에서
            만나보세요.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nav(
                `/hotels?location=${encodeURIComponent(location)}&name=${encodeURIComponent(name)}`,
              );
            }}
          >
            <input
              placeholder="지역"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              placeholder="호텔명"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button>검색</button>
          </form>
        </div>
      </section>
      <section className="section">
        <span className="eyebrow">RECOMMENDED</span>
        <h2>추천 호텔</h2>
        <p>엄선한 호텔과 투명한 가격으로 더 쉬운 여행을 경험하세요.</p>
        <Message loading={loading} error={error} empty={!loading && !hotels.length} />
        <div className="grid">
          {hotels.map((hotel) => <HotelCard key={hotel._id} hotel={hotel} />)}
        </div>
      </section>
    </>
  );
}
