import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { reservationApi } from "../api/index.js";
import { Image, Message } from "../components.jsx";
import { money } from "../utils/reservation.js";
const date = (v) => new Date(v).toLocaleDateString("ko-KR");
export function ReservationsPage() {
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const load = () =>
    reservationApi
      .list()
      .then(setRows)
      .catch((x) =>
        setError(x.response?.data?.message || "예약을 불러오지 못했습니다."),
      )
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);
  return (
    <section className="section">
      <h1>내 예약</h1>
      <Message
        loading={loading}
        error={error}
        empty={!loading && !rows.length}
      />
      <div className="reservations">
        {rows.map((r) => (
          <article className="room" key={r._id}>
            <Image src={r.hotel?.images?.[0]} alt={r.hotel?.name} />
            <div>
              <span className={`badge ${r.status}`}>
                {r.status === "cancelled" ? "예약 취소" : "예약 확정"}
              </span>
              <h3>{r.hotel?.name}</h3>
              <p>
                {r.room?.name} · {date(r.checkIn)} ~ {date(r.checkOut)}
              </p>
              <b>
                {r.nights}박 · {money(r.totalPrice)}
              </b>
              <div>
                <Link className="button" to={`/reservations/${r._id}`}>
                  상세보기
                </Link>
                {r.status === "confirmed" && (
                  <button
                    onClick={() => reservationApi.cancel(r._id).then(load)}
                  >
                    예약 취소
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
export function ReservationDetailPage() {
  const { id } = useParams(),
    [r, setR] = useState(),
    [error, setError] = useState("");
  useEffect(() => {
    reservationApi
      .get(id)
      .then(setR)
      .catch((x) => setError(x.response?.data?.message));
  }, [id]);
  if (!r) return <Message loading={!error} error={error} />;
  return (
    <section className="section narrow">
      <h1>예약 상세</h1>
      <article className="booking">
        <h2>{r.hotel?.name}</h2>
        <p>예약 ID: {r._id}</p>
        <p>객실: {r.room?.name}</p>
        <p>체크인: {date(r.checkIn)}</p>
        <p>체크아웃: {date(r.checkOut)}</p>
        <p>
          숙박: {r.nights}박 · 인원: {r.guests}명
        </p>
        <h3>총 금액: {money(r.totalPrice)}</h3>
      </article>
    </section>
  );
}
export function CompletePage() {
  const r = useLocation().state?.reservation;
  if (!r)
    return (
      <section className="section">
        <h1>예약 정보를 찾을 수 없습니다.</h1>
        <Link to="/hotels">호텔 찾기</Link>
      </section>
    );
  return (
    <section className="complete">
      <span>✓</span>
      <h1>예약이 완료되었습니다.</h1>
      <p>예약 ID: {r._id}</p>
      <p>
        {date(r.checkIn)} ~ {date(r.checkOut)} · {r.nights}박 · {r.guests}명
      </p>
      <h2>{money(r.totalPrice)}</h2>
      <Link className="button" to="/reservations">
        내 예약 보기
      </Link>
    </section>
  );
}
