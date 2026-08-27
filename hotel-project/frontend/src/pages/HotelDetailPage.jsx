import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hotelApi, reservationApi, reviewApi } from "../api/index.js";
import { Image, Message } from "../components.jsx";
import { bookingSummary, money, reviewableReservations } from "../utils/reservation.js";
import { useAuth } from "../context/AuthContext.jsx";
export default function HotelDetailPage() {
  const { id } = useParams(),
    nav = useNavigate(),
    { user } = useAuth(),
    [hotel, setHotel] = useState(),
    [rooms, setRooms] = useState([]),
    [reviews, setReviews] = useState([]),
    [reservations, setReservations] = useState([]),
    [chosen, setChosen] = useState(),
    [form, setForm] = useState({ checkIn: "", checkOut: "", guests: 1 }),
    [error, setError] = useState("");
  const load = () =>
    Promise.all([hotelApi.get(id), hotelApi.rooms(id), reviewApi.list(id)])
      .then(([h, r, v]) => {
        setHotel(h);
        setRooms(r);
        setReviews(v);
      })
      .catch((x) =>
        setError(
          x.response?.data?.message || "호텔 정보를 불러오지 못했습니다.",
        ),
      );
  useEffect(() => {
    load();
  }, [id]);
  useEffect(() => {
    if (user) reservationApi.list().then(setReservations).catch(() => setReservations([]));
  }, [user]);
  useEffect(() => {
    if (form.checkIn && form.checkOut) {
      hotelApi.rooms(id, { checkIn: form.checkIn, checkOut: form.checkOut }).then(setRooms);
    }
  }, [id, form.checkIn, form.checkOut]);
  async function reserve(e) {
    e.preventDefault();
    if (!user) return nav("/login");
    try {
      bookingSummary(form.checkIn, form.checkOut, chosen.price);
      if (+form.guests > chosen.capacity)
        throw new Error("객실 최대 인원을 초과했습니다.");
      const r = await reservationApi.create({ ...form, room: chosen._id });
      nav("/reservations/complete", { state: { reservation: r } });
    } catch (x) {
      setError(x.response?.data?.message || x.message);
    }
  }
  if (!hotel) return <Message loading={!error} error={error} />;
  let sum;
  try {
    if (chosen && form.checkIn && form.checkOut)
      sum = bookingSummary(form.checkIn, form.checkOut, chosen.price);
  } catch {}
  return (
    <>
      <section className="detailHero">
        <Image src={hotel.images?.[0]} alt={hotel.name} />
        <div>
          <span className="eyebrow">{hotel.location}</span>
          <h1>{hotel.name}</h1>
          <p>{hotel.address}</p>
          <p>
            ★ {hotel.rating?.toFixed(1)} · 후기 {hotel.reviewCount}개
          </p>
        </div>
      </section>
      <section className="section narrow">
        <h2>호텔 소개</h2>
        <p>{hotel.description}</p>
        <p>{hotel.amenities?.join(" · ")}</p>
        <h2>객실 선택</h2>
        <div className="rooms">
          {rooms.map((r) => (
            <article
              className={`room ${chosen?._id === r._id ? "selected" : ""}`}
              key={r._id}
            >
              <Image src={r.images?.[0]} alt={r.name} />
              <div>
                <h3>{r.name}</h3>
                <p>{r.description}</p>
                <p>최대 {r.capacity}명</p>
                <b>{money(r.price)} / 1박</b>
                <p>{r.isAvailable ? "예약 가능" : "선택 날짜 예약 완료"}</p>
                <button disabled={!r.isAvailable} onClick={() => setChosen(r)}>객실 선택</button>
              </div>
            </article>
          ))}
        </div>
        {chosen && (
          <form className="booking" onSubmit={reserve}>
            <h2>{chosen.name} 예약</h2>
            <label>
              체크인
              <input
                type="date"
                value={form.checkIn}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
              />
            </label>
            <label>
              체크아웃
              <input
                type="date"
                value={form.checkOut}
                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
              />
            </label>
            <label>
              인원
              <input
                type="number"
                min="1"
                max={chosen.capacity}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
              />
            </label>
            {sum && (
              <p>
                <b>
                  {sum.nights}박 · 총 {money(sum.totalPrice)}
                </b>
              </p>
            )}
            {error && <p className="error">{error}</p>}
            <button>예약하기</button>
          </form>
        )}
        <ReviewBlock
          hotel={hotel}
          reviews={reviews}
          user={user}
          reservations={reviewableReservations(reservations, hotel._id)}
          reload={load}
        />
      </section>
    </>
  );
}
function ReviewBlock({ hotel, reviews, user, reservations, reload }) {
  const [v, setV] = useState({ reservation: "", rating: 5, content: "" }),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      await reviewApi.create({ ...v, hotel: hotel._id });
      setV({ reservation: "", rating: 5, content: "" });
      reload();
    } catch (x) {
      setError(x.response?.data?.message || "후기를 등록하지 못했습니다.");
    }
  }
  return (
    <section className="reviews">
      <h2>후기</h2>
      {!reviews.length && <p>아직 등록된 후기가 없습니다.</p>}
      {reviews.map((r) => (
        <article key={r._id}>
          <b>
            {r.user?.name} · {"★".repeat(r.rating)}
          </b>
          <p>{r.content}</p>
          {user?.id === r.user?._id && (
            <button
              className="link"
              onClick={() => reviewApi.remove(r._id).then(reload)}
            >
              삭제
            </button>
          )}
        </article>
      ))}
      {user ? (
        <form onSubmit={submit}>
          <h3>후기 작성</h3>
          <select
            value={v.reservation}
            onChange={(e) => setV({ ...v, reservation: e.target.value })}
          >
            <option value="">후기를 작성할 예약 선택</option>
            {reservations.map((reservation) => (
              <option key={reservation._id} value={reservation._id}>
                {reservation.room?.name} · {new Date(reservation.checkIn).toLocaleDateString("ko-KR")}
              </option>
            ))}
          </select>
          <select
            value={v.rating}
            onChange={(e) => setV({ ...v, rating: e.target.value })}
          >
            {[5, 4, 3, 2, 1].map((x) => (
              <option key={x} value={x}>
                {"★".repeat(x)}
              </option>
            ))}
          </select>
          <textarea
            placeholder="숙박 경험을 들려주세요."
            value={v.content}
            onChange={(e) => setV({ ...v, content: e.target.value })}
          />
          {error && <p className="error">{error}</p>}
          <button>등록</button>
        </form>
      ) : (
        <p>후기 작성은 로그인이 필요합니다.</p>
      )}
    </section>
  );
}
