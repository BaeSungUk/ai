import { deleteReview } from "../api/reviewApi.js";

import { formatDate, getErrorMessage, getId } from "../utils/format.js";

function ReviewList({ reviews, onChanged }) {
  const userString = localStorage.getItem("user");

  const currentUser = userString ? JSON.parse(userString) : null;

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm("후기를 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteReview(reviewId);

      alert("후기가 삭제되었습니다.");

      onChanged();
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  if (reviews.length === 0) {
    return <div className="status-box">아직 등록된 후기가 없습니다.</div>;
  }

  return (
    <div className="review-list">
      {reviews.map((review) => {
        const writerId = getId(review.user);

        const mine = currentUser?._id === writerId;

        return (
          <article key={review._id} className="review-card">
            <div className="review-header">
              <div>
                <strong>{review.user?.nickname || "사용자"}</strong>

                <div className="review-stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
              </div>

              <span>{formatDate(review.createdAt)}</span>
            </div>

            <p>{review.comment}</p>

            {mine && (
              <button
                type="button"
                className="danger-text-button"
                onClick={() => handleDelete(review._id)}
              >
                내 후기 삭제
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default ReviewList;
