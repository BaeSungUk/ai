import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router";

import { getReservations } from "../api/reservationApi.js";

import { formatDate, formatPrice, getErrorMessage } from "../utils/format.js";

function ReservationListPage() {
  const [reservations, setReservations] = useState([]);

  const [loading, setLoading] = useState(true);

  const [checkInFilter, setCheckInFilter] = useState("");

  const [checkOutFilter, setCheckOutFilter] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const result = await getReservations();

        setReservations(result.data || []);
      } catch (error) {
        alert(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      if (
        checkInFilter &&
        new Date(reservation.checkInDate) < new Date(checkInFilter)
      ) {
        return false;
      }

      if (
        checkOutFilter &&
        new Date(reservation.checkOutDate) > new Date(checkOutFilter)
      ) {
        return false;
      }

      return true;
    });
  }, [reservations, checkInFilter, checkOutFilter]);

  return (
    <div className="page">
      <div className="page-heading">
        <h1>내 예약</h1>

        <p>StayHub 예약 내역을 확인할 수 있습니다.</p>
      </div>

      <div className="reservation-filter">
        <label>
          체크인
          <input
            type="date"
            value={checkInFilter}
            onChange={(e) => setCheckInFilter(e.target.value)}
          />
        </label>

        <label>
          체크아웃
          <input
            type="date"
            value={checkOutFilter}
            onChange={(e) => setCheckOutFilter(e.target.value)}
          />
        </label>

        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setCheckInFilter("");
            setCheckOutFilter("");
          }}
        >
          초기화
        </button>
      </div>

      {loading ? (
        <div className="status-box">예약을 불러오는 중...</div>
      ) : filteredReservations.length === 0 ? (
        <div className="status-box">예약 내역이 없습니다.</div>
      ) : (
        <div className="reservation-list">
          {filteredReservations.map((reservation) => (
            <Link
              key={reservation._id}
              to={`/reservations/${reservation._id}`}
              className="reservation-card"
            >
              <div>
                <span
                  className={
                    reservation.status === "cancelled"
                      ? "status cancelled"
                      : "status confirmed"
                  }
                >
                  {reservation.status === "cancelled"
                    ? "예약 취소"
                    : "예약 완료"}
                </span>

                <h2>{reservation.hotel?.hotelName || "호텔"}</h2>

                <p>{reservation.room?.roomName || "객실"}</p>
              </div>

              <div className="reservation-card-info">
                <span>
                  {formatDate(reservation.checkInDate)}
                  {" ~ "}
                  {formatDate(reservation.checkOutDate)}
                </span>

                <strong>{formatPrice(reservation.totalPrice)}원</strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReservationListPage;
