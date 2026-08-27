import { Link, NavLink, useLocation, useNavigate } from "react-router";

function Header() {
  const navigate = useNavigate();

  // 경로가 바뀔 때 Header도 다시 렌더링
  useLocation();

  const token = localStorage.getItem("token");

  const userString = localStorage.getItem("user");

  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("로그아웃 되었습니다.");

    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          StayHub
        </Link>

        <nav className="nav">
          <NavLink to="/">호텔</NavLink>

          {token && (
            <>
              <NavLink to="/reservations">내 예약</NavLink>
              <NavLink to="/my-hotels">내 호텔</NavLink>
              <NavLink to="/hotels/new">호텔 등록</NavLink>
            </>
          )}

          {!token ? (
            <>
              <NavLink to="/login">로그인</NavLink>

              <NavLink to="/signup">회원가입</NavLink>
            </>
          ) : (
            <>
              <span className="nickname">{user?.nickname}님</span>

              <button
                type="button"
                className="text-button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
