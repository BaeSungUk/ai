import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
export default function MainLayout() {
  const { user, logout } = useAuth(),
    nav = useNavigate();
  return (
    <>
      <header>
        <Link className="brand" to="/">
          StayHub
        </Link>
        <nav>
          <NavLink to="/hotels">호텔 찾기</NavLink>
          {user && <NavLink to="/reservations">내 예약</NavLink>}
          {user ? (
            <>
              <span>{user.name}님</span>
              <button
                className="link"
                onClick={() => {
                  logout();
                  nav("/");
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">로그인</NavLink>
              <NavLink to="/signup">회원가입</NavLink>
            </>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>© 2026 StayHub · 여행의 시작을 편안하게</footer>
    </>
  );
}
