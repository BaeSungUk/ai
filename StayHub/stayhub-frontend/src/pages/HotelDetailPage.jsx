import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router";

import { deleteHotel, getHotelDetail, getRooms } from "../api/hotelApi.js";

import { deleteRoom, getRoomAvailability } from "../api/roomApi.js";

import { createReservation } from "../api/reservationApi.js";

import { getReviews } from "../api/reviewApi.js";

import RoomCard from "../components/RoomCard.jsx";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

import {
  calculateNights,
  formatPrice,
  getErrorMessage,
  getId,
} from "../utils/format.js";

const getDateInputValue = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getNextDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);

  date.setDate(date.getDate() + 1);

  return getDateInputValue(date);
};

function HotelDetailPage() {
  const { hotelId } = useParams();

  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);

  const [rooms, setRooms] = useState([]);

  const [reviews, setReviews] = useState([]);

  const [availability, setAvailability] = useState({});

  const [selectedRoomId, setSelectedRoomId] = useState("");

  const [checkInDate, setCheckInDate] = useState("");

  const [checkOutDate, setCheckOutDate] = useState("");

  const [guestCount, setGuestCount] = useState(1);

  const [loading, setLoading] = useState(true);

  const userString = localStorage.getItem("user");

  const currentUser = userString ? JSON.parse(userString) : null;

  const isOwner =
    currentUser && hotel && getId(hotel.createdBy) === currentUser._id;

  const today = getDateInputValue(new Date());

  const loadReviews = async () => {
    const result = await getReviews(hotelId);

    setReviews(result.data || []);
  };

  const handleDeleteHotel = async () => {
    const confirmed = window.confirm("정말 이 호텔을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteHotel(hotelId);

      alert("호텔이 삭제되었습니다.");

      navigate("/");
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const confirmed = window.confirm("정말 이 객실을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteRoom(roomId);

      alert("객실이 삭제되었습니다.");

      // 화면에서도 바로 삭제
      setRooms((prev) => prev.filter((room) => room._id !== roomId));

      if (selectedRoomId === roomId) {
        setSelectedRoomId("");
      }
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);

        const [hotelResult, roomResult, reviewResult] = await Promise.all([
          getHotelDetail(hotelId),
          getRooms(hotelId),
          getReviews(hotelId),
        ]);

        setHotel(hotelResult.data);

        setRooms(roomResult.data || []);

        setReviews(reviewResult.data || []);
      } catch (error) {
        alert(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [hotelId]);

  const nights = useMemo(
    () => calculateNights(checkInDate, checkOutDate),
    [checkInDate, checkOutDate],
  );

  const selectedRoom = useMemo(
    () => rooms.find((room) => room._id === selectedRoomId),
    [rooms, selectedRoomId],
  );

  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0;

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const datesSelected = nights > 0;

  useEffect(() => {
    if (!datesSelected || rooms.length === 0) {
      return;
    }

    let active = true;

    const checkRooms = async () => {
      try {
        const result = await Promise.all(
          rooms.map(async (room) => {
            const response = await getRoomAvailability(
              room._id,
              checkInDate,
              checkOutDate,
            );

            return [room._id, response.data.available];
          }),
        );

        const map = Object.fromEntries(result);

        if (!active) {
          return;
        }

        setAvailability(map);

        setSelectedRoomId((currentRoomId) =>
          currentRoomId && map[currentRoomId] === false ? "" : currentRoomId,
        );
      } catch (error) {
        if (active) {
          console.error(error);
        }
      }
    };

    checkRooms();

    return () => {
      active = false;
    };
  }, [checkInDate, checkOutDate, datesSelected, rooms]);

  const handleReservation = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");

      navigate("/login", {
        state: {
          from: `/hotels/${hotelId}`,
        },
      });

      return;
    }

    if (!selectedRoom) {
      alert("객실을 선택해주세요.");

      return;
    }

    if (guestCount > selectedRoom.maxGuests) {
      alert(`최대 ${selectedRoom.maxGuests}명까지 예약할 수 있습니다.`);

      return;
    }

    try {
      const result = await createReservation({
        roomId: selectedRoom._id,
        checkInDate,
        checkOutDate,
        guestCount: Number(guestCount),
      });

      navigate("/reservations/complete", {
        state: {
          reservation: result.data,
          hotelName: hotel.hotelName,
          roomName: selectedRoom.roomName,
        },
      });
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="status-box">호텔 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="page">
        <div className="status-box">호텔이 존재하지 않습니다.</div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="detail-header">
        <div className="detail-image">
          {hotel.image ? (
            <img src={hotel.image} alt={hotel.hotelName} />
          ) : (
            <div className="image-placeholder large">StayHub</div>
          )}
        </div>

        <div className="detail-info">
          <span className="region-badge">{hotel.region}</span>

          <h1>{hotel.hotelName}</h1>

          <p>{hotel.address}</p>

          <div className="rating large-rating">
            ★ {averageRating}
            <span>({reviews.length}개 후기)</span>
          </div>

          <p>{hotel.description}</p>

          <strong className="detail-price">
            {formatPrice(hotel.price)}
            원~
          </strong>
          {isOwner && (
            <div className="owner-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate(`/hotels/${hotelId}/edit`)}
              >
                호텔 수정
              </button>

              <button
                type="button"
                className="danger-button"
                onClick={handleDeleteHotel}
              >
                호텔 삭제
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="content-section">
        <h2>예약 날짜</h2>

        <div className="reservation-search">
          <label>
            체크인
            <input
              type="date"
              min={today}
              value={checkInDate}
              onChange={(e) => {
                setCheckInDate(e.target.value);

                setCheckOutDate("");

                setSelectedRoomId("");
              }}
            />
          </label>

          <label>
            체크아웃
            <input
              type="date"
              min={checkInDate ? getNextDate(checkInDate) : today}
              disabled={!checkInDate}
              value={checkOutDate}
              onChange={(e) => {
                setCheckOutDate(e.target.value);

                setSelectedRoomId("");
              }}
            />
          </label>

          <label>
            예약 인원
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <option key={number} value={number}>
                  {number}명
                </option>
              ))}
            </select>
          </label>
        </div>

        {datesSelected && (
          <div className="night-info">
            선택한 숙박 기간:
            <strong> {nights}박</strong>
          </div>
        )}
      </section>

      <section className="content-section">
        <div className="section-title-row">
          <h2>객실 선택</h2>

          {isOwner && (
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate(`/hotels/${hotelId}/rooms/new`)}
            >
              + 객실 등록
            </button>
          )}
        </div>

        {rooms.length === 0 ? (
          <div className="status-box">등록된 객실이 없습니다.</div>
        ) : (
          <div className="room-list">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                selected={selectedRoomId === room._id}
                availability={availability[room._id]}
                datesSelected={datesSelected}
                onSelect={setSelectedRoomId}
                isOwner={isOwner}
                onEdit={(roomId) => navigate(`/rooms/${roomId}/edit`)}
                onDelete={handleDeleteRoom}
              />
            ))}
          </div>
        )}

        {selectedRoom && (
          <div className="reservation-summary">
            <h3>예약 금액</h3>

            <div>
              <span>{selectedRoom.roomName}</span>

              <span>
                {formatPrice(selectedRoom.price)}원 × {nights}박
              </span>
            </div>

            <div>
              <span>예약 인원</span>

              <span>{guestCount}명</span>
            </div>

            <div className="total-price">
              <span>총 금액</span>

              <strong>{formatPrice(totalPrice)}원</strong>
            </div>

            <button
              type="button"
              className="primary-button full-button"
              onClick={handleReservation}
            >
              예약하기
            </button>
          </div>
        )}
      </section>

      <section className="content-section">
        <div className="section-title-row">
          <h2>후기</h2>

          <span>★ {averageRating}</span>
        </div>

        <ReviewForm
          hotelId={hotelId}
          reviews={reviews}
          onChanged={loadReviews}
        />

        <ReviewList reviews={reviews} onChanged={loadReviews} />
      </section>
    </div>
  );
}

export default HotelDetailPage;
