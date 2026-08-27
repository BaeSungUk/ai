import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="page">
      <div className="complete-card">
        <h1>404</h1>

        <p>존재하지 않는 페이지입니다.</p>

        <Link to="/" className="primary-button">
          홈으로
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
