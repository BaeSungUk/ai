import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";

import { createHotel, getHotelDetail, updateHotel } from "../api/hotelApi.js";

import { getErrorMessage, getId } from "../utils/format.js";

function HotelFormPage() {
  const { hotelId } = useParams();

  const navigate = useNavigate();

  // hotelId가 있으면 수정
  // 없으면 등록
  const editMode = Boolean(hotelId);

  const [form, setForm] = useState({
    hotelName: "",
    region: "",
    address: "",
    description: "",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editMode) {
      return;
    }

    const loadHotel = async () => {
      try {
        const result = await getHotelDetail(hotelId);

        const hotel = result.data;

        const userString = localStorage.getItem("user");

        const user = userString ? JSON.parse(userString) : null;

        // 프론트에서도 작성자 확인
        if (getId(hotel.createdBy) !== user?._id) {
          alert("본인이 등록한 호텔만 수정할 수 있습니다.");

          navigate(`/hotels/${hotelId}`, {
            replace: true,
          });

          return;
        }

        setForm({
          hotelName: hotel.hotelName || "",

          region: hotel.region || "",

          address: hotel.address || "",

          description: hotel.description || "",

          price: hotel.price || "",

          image: hotel.image || "",
        });
      } catch (error) {
        alert(getErrorMessage(error));
      }
    };

    loadHotel();
  }, [editMode, hotelId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (
      !form.hotelName.trim() ||
      !form.region.trim() ||
      !form.address.trim() ||
      !form.description.trim() ||
      !form.price
    ) {
      alert("호텔 정보를 모두 입력해주세요.");

      return false;
    }

    if (Number(form.price) < 0) {
      alert("가격을 올바르게 입력해주세요.");

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const hotelData = {
      hotelName: form.hotelName.trim(),

      region: form.region.trim(),

      address: form.address.trim(),

      description: form.description.trim(),

      price: Number(form.price),

      image: form.image.trim(),
    };

    try {
      setLoading(true);

      if (editMode) {
        await updateHotel(hotelId, hotelData);

        alert("호텔이 수정되었습니다.");

        navigate(`/hotels/${hotelId}`);
      } else {
        const result = await createHotel(hotelData);

        alert("호텔이 등록되었습니다.");

        navigate(`/hotels/${result.data._id}`);
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
        <h1>{editMode ? "호텔 수정" : "호텔 등록"}</h1>

        <label>
          호텔명
          <input
            name="hotelName"
            value={form.hotelName}
            onChange={handleChange}
            placeholder="StayHub 서울 호텔"
          />
        </label>

        <label>
          지역
          <input
            name="region"
            value={form.region}
            onChange={handleChange}
            placeholder="서울"
          />
        </label>

        <label>
          주소
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="서울특별시 중구"
          />
        </label>

        <label>
          대표 가격
          <input
            type="number"
            name="price"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="120000"
          />
        </label>

        <label>
          호텔 설명
          <textarea
            name="description"
            rows="6"
            value={form.description}
            onChange={handleChange}
            placeholder="호텔에 대한 설명을 입력해주세요."
          />
        </label>

        <label>
          이미지 URL
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        <button className="primary-button full-button" disabled={loading}>
          {loading ? "처리 중..." : editMode ? "호텔 수정" : "호텔 등록"}
        </button>
      </form>
    </div>
  );
}

export default HotelFormPage;
