import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";

import { createRoom, getRoomDetail, updateRoom } from "../api/roomApi.js";

import { getErrorMessage } from "../utils/format.js";

function RoomFormPage() {
  const { hotelId, roomId } = useParams();

  const navigate = useNavigate();

  const editMode = Boolean(roomId);

  const [form, setForm] = useState({
    roomName: "",
    price: "",
    maxGuests: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  // 수정일 경우 기존 객실 불러오기
  useEffect(() => {
    if (!editMode) {
      return;
    }

    const loadRoom = async () => {
      try {
        const result = await getRoomDetail(roomId);

        const room = result.data;

        setForm({
          roomName: room.roomName || "",

          price: room.price || "",

          maxGuests: room.maxGuests || "",

          description: room.description || "",

          image: room.image || "",
        });
      } catch (error) {
        alert(getErrorMessage(error));
      }
    };

    loadRoom();
  }, [editMode, roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.roomName.trim() || !form.price || !form.maxGuests) {
      alert("객실 정보를 입력해주세요.");

      return false;
    }

    if (Number(form.price) < 0) {
      alert("가격을 올바르게 입력해주세요.");

      return false;
    }

    if (Number(form.maxGuests) < 1) {
      alert("최대 인원은 1명 이상이어야 합니다.");

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const roomData = {
      roomName: form.roomName.trim(),

      price: Number(form.price),

      maxGuests: Number(form.maxGuests),

      description: form.description.trim(),

      image: form.image.trim(),
    };

    try {
      setLoading(true);

      if (editMode) {
        const result = await updateRoom(roomId, roomData);

        alert("객실이 수정되었습니다.");

        const targetHotelId = result.data.hotel?._id || result.data.hotel;

        navigate(`/hotels/${targetHotelId}`);
      } else {
        await createRoom(hotelId, roomData);

        alert("객실이 등록되었습니다.");

        navigate(`/hotels/${hotelId}`);
      }
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <form className="hotel-form" onSubmit={handleSubmit}>
        <h1>{editMode ? "객실 수정" : "객실 등록"}</h1>

        <label>
          객실명
          <input
            name="roomName"
            value={form.roomName}
            onChange={handleChange}
            placeholder="디럭스 더블룸"
          />
        </label>

        <label>
          1박 가격
          <input
            type="number"
            name="price"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="150000"
          />
        </label>

        <label>
          최대 숙박 인원
          <input
            type="number"
            name="maxGuests"
            min="1"
            value={form.maxGuests}
            onChange={handleChange}
            placeholder="2"
          />
        </label>

        <label>
          객실 설명
          <textarea
            name="description"
            rows="5"
            value={form.description}
            onChange={handleChange}
            placeholder="객실 설명을 입력해주세요."
          />
        </label>

        <label>
          객실 이미지 URL
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="/images/rooms/deluxe.png"
          />
        </label>

        <button className="primary-button full-button" disabled={loading}>
          {loading ? "처리 중..." : editMode ? "객실 수정" : "객실 등록"}
        </button>
      </form>
    </div>
  );
}

export default RoomFormPage;
