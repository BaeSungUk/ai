import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

import { deleteHotel, getMyHotels } from "../api/hotelApi.js";

import { formatPrice, getErrorMessage } from "../utils/format.js";

function MyHotelPage() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getMyHotels()
      .then((result) => {
        if (active) {
          setHotels(result.data || []);
        }
      })
      .catch((error) => {
        if (active) {
          alert(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (hotelId) => {
    const confirmed = window.confirm("정말 이 호텔을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteHotel(hotelId);

      alert("호텔이 삭제되었습니다.");

      setHotels((prev) => prev.filter((hotel) => hotel._id !== hotelId));
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  if (loading) {
    return <div className="page">내 호텔 정보를 불러오는 중...</div>;
  }

  return (
    <div className="page">
      <div className="my-hotel-heading">
        <div>
          <h1>내 호텔 관리</h1>

          <p>내가 등록한 호텔을 관리할 수 있습니다.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/hotels/new")}
        >
          + 호텔 등록
        </button>
      </div>

      {hotels.length === 0 ? (
        <div className="status-box">
          <p>아직 등록한 호텔이 없습니다.</p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/hotels/new")}
          >
            첫 호텔 등록하기
          </button>
        </div>
      ) : (
        <div className="my-hotel-list">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="my-hotel-card">
              <div className="my-hotel-image">
                {hotel.image ? (
                  <img src={hotel.image} alt={hotel.hotelName} />
                ) : (
                  <div className="image-placeholder">StayHub</div>
                )}
              </div>

              <div className="my-hotel-info">
                <span className="region-badge">{hotel.region}</span>

                <h2>{hotel.hotelName}</h2>

                <p className="hotel-address">{hotel.address}</p>

                <div className="my-hotel-meta">
                  <span className="rating">
                    ★ {Number(hotel.averageRating || 0).toFixed(1)}
                  </span>

                  <span>후기 {hotel.reviewCount || 0}개</span>

                  <strong>
                    {formatPrice(hotel.price)}
                    원~
                  </strong>
                </div>

                <div className="my-hotel-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate(`/hotels/${hotel._id}`)}
                  >
                    상세보기
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate(`/hotels/${hotel._id}/edit`)}
                  >
                    수정
                  </button>

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate(`/hotels/${hotel._id}`)}
                  >
                    객실관리
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(hotel._id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyHotelPage;
