import { formatPrice } from "../utils/format.js";

function RoomCard({
  room,
  selected,
  availability,
  datesSelected,
  onSelect,

  // 추가
  isOwner,
  onEdit,
  onDelete,
}) {
  let availabilityText = "날짜를 선택해주세요.";

  let availabilityClass = "";

  if (datesSelected) {
    if (availability === true) {
      availabilityText = "✓ 예약 가능";

      availabilityClass = "available";
    }

    if (availability === false) {
      availabilityText = "✕ 예약 불가";

      availabilityClass = "unavailable";
    }
  }

  return (
    <div className={selected ? "room-card selected" : "room-card"}>
      <div className="room-image">
        {room.image ? (
          <img src={room.image} alt={room.roomName} />
        ) : (
          <div className="room-image-placeholder">StayHub</div>
        )}
      </div>

      <div className="room-card-content">
        <h3>{room.roomName}</h3>

        <p>최대 {room.maxGuests}명</p>

        <p>{room.description}</p>

        <strong>{formatPrice(room.price)}원 / 1박</strong>

        {/* 호텔 작성자에게만 표시 */}
        {isOwner && (
          <div className="room-owner-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => onEdit(room._id)}
            >
              객실 수정
            </button>

            <button
              type="button"
              className="danger-button"
              onClick={() => onDelete(room._id)}
            >
              객실 삭제
            </button>
          </div>
        )}
      </div>

      <div className="room-card-action">
        <span className={`availability ${availabilityClass}`}>
          {availabilityText}
        </span>

        <button
          type="button"
          className="primary-button"
          disabled={!datesSelected || availability !== true}
          onClick={() => onSelect(room._id)}
        >
          {selected ? "선택됨" : "객실 선택"}
        </button>
      </div>
    </div>
  );
}

export default RoomCard;
