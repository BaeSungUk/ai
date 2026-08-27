import { Link, useLocation } from "react-router";

import { formatDate, formatPrice } from "../utils/format.js";

function ReservationCompletePage() {
  const location = useLocation();

  const reservation = location.state?.reservation;

  const hotelName = location.state?.hotelName;

  const roomName = location.state?.roomName;

  if (!reservation) {
    return (
      <div className="page">
        <div className="complete-card">
          <h1>예약 완료</h1>

          <p>예약 내역에서 예약 정보를 확인해주세요.</p>

          <Link to="/reservations" className="primary-button">
            내 예약 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="complete-card">
        <div className="complete-icon">✓</div>

        <h1>예약이 완료되었습니다!</h1>

        <p>StayHub 예약이 정상적으로 처리되었습니다.</p>

        <div className="complete-info">
          <div>
            <span>호텔</span>
            <strong>{hotelName}</strong>
          </div>

          <div>
            <span>객실</span>
            <strong>{roomName}</strong>
          </div>

          <div>
            <span>체크인</span>
            <strong>{formatDate(reservation.checkInDate)}</strong>
          </div>

          <div>
            <span>체크아웃</span>
            <strong>{formatDate(reservation.checkOutDate)}</strong>
          </div>

          <div>
            <span>총 금액</span>
            <strong>{formatPrice(reservation.totalPrice)}원</strong>
          </div>
        </div>

        <Link to="/reservations" className="primary-button">
          내 예약 확인
        </Link>
      </div>
    </div>
  );
}

export default ReservationCompletePage;
