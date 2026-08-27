import { Link } from "react-router";

import { formatPrice } from "../utils/format.js";

function HotelCard({ hotel }) {
  return (
    <Link to={`/hotels/${hotel._id}`} className="hotel-card">
      <div className="hotel-image">
        {hotel.image ? (
          <img src={hotel.image} alt={hotel.hotelName} />
        ) : (
          <div className="image-placeholder">StayHub</div>
        )}
      </div>

      <div className="hotel-card-content">
        <span className="region-badge">{hotel.region}</span>

        <h2>{hotel.hotelName}</h2>

        <p className="hotel-address">{hotel.address}</p>

        <div className="hotel-card-bottom">
          <span className="rating">
            ★ {Number(hotel.averageRating || 0).toFixed(1)}
          </span>

          <strong>
            {formatPrice(hotel.price)}
            원~
          </strong>
        </div>
      </div>
    </Link>
  );
}

export default HotelCard;
