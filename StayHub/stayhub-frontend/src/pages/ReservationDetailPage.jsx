import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router";

import {
  cancelReservation,
  checkInReservation,
  checkOutReservation,
  getReservationDetail,
} from "../api/reservationApi.js";

import {
  calculateNights,
  formatDate,
  formatPrice,
  getErrorMessage,
  getId,
} from "../utils/format.js";

const getDateOnly = (value) => {
  const date = new Date(value);

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const STATUS_TEXT = {
  confirmed: "예약 완료",
  checkedIn: "체크인",
  checkedOut: "체크아웃",
  cancelled: "예약 취소",
};

function ReservationDetailPage() {
  const { reservationId } = useParams();

  const [reservation, setReservation] = useState(null);

  const [loading, setLoading] = useState(true);

  const loadReservation = async () => {
    try {
      setLoading(true);

      const result = await getReservationDetail(reservationId);

      setReservation(result.data);
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    getReservationDetail(reservationId)
      .then((result) => {
        if (active) {
          setReservation(result.data);
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
  }, [reservationId]);

  const nights = useMemo(() => {
    if (!reservation) {
      return 0;
    }

    return calculateNights(reservation.checkInDate, reservation.checkOutDate);
  }, [reservation]);

  if (loading) {
    return <div className="page">예약 정보를 불러오는 중...</div>;
  }

  if (!reservation) {
    return <div className="page">예약 정보가 없습니다.</div>;
  }

  const today = getDateOnly(new Date());

  const checkInDate = getDateOnly(reservation.checkInDate);

  const checkOutDate = getDateOnly(reservation.checkOutDate);

  const canCheckIn =
    reservation.status === "confirmed" &&
    today >= checkInDate &&
    today < checkOutDate;

  const canCheckOut =
    reservation.status === "checkedIn" && today <= checkOutDate;

  const canCancel = reservation.status === "confirmed";

  const handleCheckIn = async () => {
    try {
      await checkInReservation(reservationId);

      alert("체크인이 완료되었습니다.");

      await loadReservation();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOutReservation(reservationId);

      alert("체크아웃이 완료되었습니다.");

      await loadReservation();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm("예약을 취소하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await cancelReservation(reservationId);

      alert("예약이 취소되었습니다.");

      await loadReservation();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  return (
    <div className="page">
      <div className="reservation-detail-card">
        <h1>예약 상세</h1>

        <div className="detail-table">
          <div>
            <span>호텔</span>

            <strong>{reservation.hotel?.hotelName}</strong>
          </div>

          <div>
            <span>객실</span>

            <strong>{reservation.room?.roomName}</strong>
          </div>

          <div>
            <span>체크인 날짜</span>

            <strong>{formatDate(reservation.checkInDate)}</strong>
          </div>

          <div>
            <span>체크아웃 날짜</span>

            <strong>{formatDate(reservation.checkOutDate)}</strong>
          </div>

          <div>
            <span>숙박</span>

            <strong>{nights}박</strong>
          </div>

          <div>
            <span>예약 인원</span>

            <strong>{reservation.guestCount}명</strong>
          </div>

          <div>
            <span>총 금액</span>

            <strong>{formatPrice(reservation.totalPrice)}원</strong>
          </div>

          <div>
            <span>예약 상태</span>

            <strong>
              {STATUS_TEXT[reservation.status] || reservation.status}
            </strong>
          </div>
        </div>

        {reservation.actualCheckInAt && (
          <div className="info-box">
            실제 체크인:{" "}
            {new Date(reservation.actualCheckInAt).toLocaleString("ko-KR")}
          </div>
        )}

        {reservation.actualCheckOutAt && (
          <div className="info-box">
            실제 체크아웃:{" "}
            {new Date(reservation.actualCheckOutAt).toLocaleString("ko-KR")}
          </div>
        )}

        <div className="reservation-actions">
          {reservation.status === "confirmed" && (
            <button
              type="button"
              className="primary-button"
              disabled={!canCheckIn}
              onClick={handleCheckIn}
            >
              체크인
            </button>
          )}

          {reservation.status === "checkedIn" && (
            <button
              type="button"
              className="primary-button"
              disabled={!canCheckOut}
              onClick={handleCheckOut}
            >
              체크아웃
            </button>
          )}

          {canCancel && (
            <button
              type="button"
              className="danger-button"
              onClick={handleCancel}
            >
              예약 취소
            </button>
          )}
        </div>

        {reservation.status === "confirmed" && !canCheckIn && (
          <p className="input-guide">체크인은 예약 기간에만 가능합니다.</p>
        )}

        <div className="detail-link-actions">
          <Link
            to={`/hotels/${getId(reservation.hotel)}`}
            className="secondary-link"
          >
            호텔 상세보기
          </Link>

          <Link to="/reservations" className="secondary-link">
            예약 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReservationDetailPage;
