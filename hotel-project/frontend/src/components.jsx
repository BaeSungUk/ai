import { Link } from "react-router-dom";
import { money } from "./utils/reservation.js";
export const Message = ({ loading, error, empty }) =>
  loading ? (
    <p className="message">불러오는 중...</p>
  ) : error ? (
    <p className="message error">{error}</p>
  ) : empty ? (
    <p className="message">검색 결과가 없습니다.</p>
  ) : null;
export function Image({ src, alt }) {
  return (
    <img
      src={
        src ||
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900"
      }
      alt={alt}
      onError={(e) => {
        e.currentTarget.src =
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900";
      }}
    />
  );
}
export function HotelCard({ hotel }) {
  return (
    <article className="card">
      <Image src={hotel.images?.[0]} alt={hotel.name} />
      <div className="pad">
        <span className="eyebrow">{hotel.location}</span>
        <h3>{hotel.name}</h3>
        <p>{hotel.description}</p>
        <div className="row">
          <b>{money(hotel.minPrice)}부터</b>
          <span>
            ★ {Number(hotel.rating).toFixed(1)} ({hotel.reviewCount})
          </span>
        </div>
        <Link className="button" to={`/hotels/${hotel._id}`}>
          상세보기
        </Link>
      </div>
    </article>
  );
}
