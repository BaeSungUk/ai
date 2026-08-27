import { useEffect, useState } from "react";

import { getHotels } from "../api/hotelApi.js";

import HotelCard from "../components/HotelCard.jsx";
import HotelSearch from "../components/HotelSearch.jsx";

import { getErrorMessage } from "../utils/format.js";

const INITIAL_FILTERS = {
  region: "",
  name: "",
  sort: "",
};

function HotelListPage() {
  const [hotels, setHotels] = useState([]);

  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [loading, setLoading] = useState(true);

  const handleSortChange = (sort) => {
    loadHotels({
      ...filters,
      sort,
    });
  };

  const loadHotels = async (searchParams = {}) => {
    try {
      setLoading(true);

      const result = await getHotels(searchParams);

      setHotels(result.data || []);
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleSearch = () => {
    loadHotels(filters);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);

    loadHotels();
  };

  return (
    <div className="page">
      <section className="hero">
        <p className="hero-label">STAYHUB</p>

        <h1>어디로 떠나시나요?</h1>

        <p>원하는 지역과 호텔을 검색해보세요.</p>
      </section>

      <HotelSearch
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        onSortChange={handleSortChange}
      />

      <div className="section-title-row">
        <h2>호텔</h2>

        <span>{hotels.length}개</span>
      </div>

      {loading ? (
        <div className="status-box">호텔을 불러오는 중...</div>
      ) : hotels.length === 0 ? (
        <div className="status-box">검색된 호텔이 없습니다.</div>
      ) : (
        <div className="hotel-grid">
          {hotels.map((hotel) => (
            <HotelCard key={hotel._id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HotelListPage;
