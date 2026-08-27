import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router";

import { loginUser } from "../api/authApi.js";

import { getErrorMessage } from "../utils/format.js";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    userid: "",
    userpw: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userid.trim() || !form.userpw) {
      alert("아이디와 비밀번호를 입력해주세요.");

      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        userid: form.userid.trim(),
        userpw: form.userpw,
      });

      localStorage.setItem("token", result.data.token);

      localStorage.setItem("user", JSON.stringify(result.data.user));

      alert("로그인되었습니다.");

      const moveTo = location.state?.from || "/";

      navigate(moveTo, {
        replace: true,
      });
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>로그인</h1>

        <label>
          아이디
          <input
            name="userid"
            value={form.userid}
            onChange={handleChange}
            placeholder="아이디"
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            name="userpw"
            value={form.userpw}
            onChange={handleChange}
            placeholder="비밀번호"
          />
        </label>

        <button className="primary-button full-button" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <p className="auth-link">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
