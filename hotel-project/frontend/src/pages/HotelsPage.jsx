import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { hotelApi } from "../api/index.js";
import { HotelCard, Message } from "../components.jsx";
export default function HotelsPage() {
  const [p, setP] = useSearchParams(),
    [hotels, setHotels] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const location = p.get("location") || "",
    name = p.get("name") || "",
    sort = p.get("sort") || "";
  useEffect(() => {
    setLoading(true);
    hotelApi
      .list({ location, name, sort })
      .then(setHotels)
      .catch((x) =>
        setError(x.response?.data?.message || "호텔을 불러오지 못했습니다."),
      )
      .finally(() => setLoading(false));
  }, [location, name, sort]);
  const change = (key, value) => {
    const n = new URLSearchParams(p);
    value ? n.set(key, value) : n.delete(key);
    setP(n);
  };
  return (
    <section className="section">
      <div className="title">
        <div>
          <span className="eyebrow">FIND YOUR STAY</span>
          <h1>호텔 찾기</h1>
        </div>
      </div>
      <div className="filters">
        <input
          placeholder="지역 검색"
          value={location}
          onChange={(e) => change("location", e.target.value)}
        />
        <input
          placeholder="호텔명 검색"
          value={name}
          onChange={(e) => change("name", e.target.value)}
        />
        <select value={sort} onChange={(e) => change("sort", e.target.value)}>
          <option value="">추천순</option>
          <option value="priceAsc">낮은 가격순</option>
          <option value="priceDesc">높은 가격순</option>
          <option value="ratingDesc">높은 평점순</option>
        </select>
      </div>
      <Message
        loading={loading}
        error={error}
        empty={!loading && !hotels.length}
      />
      <div className="grid">
        {hotels.map((h) => (
          <HotelCard key={h._id} hotel={h} />
        ))}
      </div>
    </section>
  );
}
