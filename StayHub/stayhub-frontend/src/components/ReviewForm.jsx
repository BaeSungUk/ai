import { useEffect, useMemo, useState } from "react";

import { createReview } from "../api/reviewApi.js";

import { getReservations } from "../api/reservationApi.js";

import { getErrorMessage, getId } from "../utils/format.js";

function ReviewForm({ hotelId, reviews, onChanged }) {
  const token = localStorage.getItem("token");

  const [reservations, setReservations] = useState([]);

  const [form, setForm] = useState({
    reservationId: "",
    rating: "5",
    comment: "",
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadReservations = async () => {
      try {
        const result = await getReservations();

        setReservations(result.data || []);
      } catch {
        setReservations([]);
      }
    };

    loadReservations();
  }, [token]);

  const availableReservations = useMemo(() => {
    const reviewedIds = reviews.map((review) => getId(review.reservation));

    return reservations.filter((reservation) => {
      const reservationHotelId = getId(reservation.hotel);

      return (
        reservationHotelId === hotelId &&
        ["confirmed", "checkedIn", "checkedOut"].includes(reservation.status) &&
        !reviewedIds.includes(reservation._id)
      );
    });
  }, [reservations, reviews, hotelId]);

  if (!token) {
    return <div className="info-box">로그인 후 후기를 작성할 수 있습니다.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.reservationId) {
      alert("후기를 작성할 예약을 선택해주세요.");

      return;
    }

    if (!form.comment.trim()) {
      alert("후기 내용을 입력해주세요.");

      return;
    }

    try {
      await createReview(hotelId, {
        reservationId: form.reservationId,
        rating: Number(form.rating),
        comment: form.comment.trim(),
      });

      alert("후기가 등록되었습니다.");

      setForm({
        reservationId: "",
        rating: "5",
        comment: "",
      });

      onChanged();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  if (availableReservations.length === 0) {
    return (
      <div className="info-box">후기를 작성할 수 있는 예약이 없습니다.</div>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>후기 작성</h3>

      <select
        value={form.reservationId}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            reservationId: e.target.value,
          }))
        }
      >
        <option value="">예약 선택</option>

        {availableReservations.map((reservation) => (
          <option key={reservation._id} value={reservation._id}>
            {reservation.room?.roomName || "예약 객실"}
          </option>
        ))}
      </select>

      <select
        value={form.rating}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            rating: e.target.value,
          }))
        }
      >
        <option value="5">★★★★★ 5점</option>

        <option value="4">★★★★☆ 4점</option>

        <option value="3">★★★☆☆ 3점</option>

        <option value="2">★★☆☆☆ 2점</option>

        <option value="1">★☆☆☆☆ 1점</option>
      </select>

      <textarea
        rows="5"
        value={form.comment}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            comment: e.target.value,
          }))
        }
        placeholder="숙박 후기를 남겨주세요."
      />

      <button className="primary-button">후기 등록</button>
    </form>
  );
}

export default ReviewForm;
