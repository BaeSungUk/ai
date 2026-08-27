import { useState } from "react";

import { Link, useNavigate } from "react-router";

import { checkEmail, signupUser } from "../api/authApi.js";

import { getErrorMessage } from "../utils/format.js";

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  return passwordRegex.test(password);
};

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userid: "",
    userpw: "",
    userpwConfirm: "",
    username: "",
    nickname: "",
    email: "",
  });

  const [emailChecked, setEmailChecked] = useState(false);

  const [loading, setLoading] = useState(false);

  const passwordValid = isValidPassword(form.userpw);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setEmailChecked(false);
    }
  };

  const handleEmailCheck = async () => {
    if (!form.email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      const result = await checkEmail(form.email.trim());

      if (result.data.available) {
        alert("사용 가능한 이메일입니다.");

        setEmailChecked(true);
      } else {
        alert("이미 사용 중인 이메일입니다.");

        setEmailChecked(false);
      }
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  const validate = () => {
    if (
      !form.userid.trim() ||
      !form.userpw ||
      !form.username.trim() ||
      !form.nickname.trim() ||
      !form.email.trim()
    ) {
      alert("모든 항목을 입력해주세요.");

      return false;
    }

    if (!isValidPassword(form.userpw)) {
      alert(
        "비밀번호는 8자 이상이며 영문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.",
      );

      return false;
    }

    if (form.userpw !== form.userpwConfirm) {
      alert("비밀번호가 일치하지 않습니다.");

      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");

      return false;
    }

    if (!emailChecked) {
      alert("이메일 중복 확인을 해주세요.");

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      await signupUser({
        userid: form.userid.trim(),
        userpw: form.userpw,
        username: form.username.trim(),
        nickname: form.nickname.trim(),
        email: form.email.trim(),
      });

      alert("회원가입이 완료되었습니다.");

      navigate("/login");
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>회원가입</h1>

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
          <span
            className={
              form.userpw && passwordValid ? "input-guide valid" : "input-guide"
            }
          >
            {form.userpw && passwordValid
              ? "✓ 사용할 수 있는 비밀번호입니다."
              : "8자 이상, 영문자·숫자·특수문자를 각각 포함해주세요."}
          </span>
        </label>

        <label>
          비밀번호 확인
          <input
            type="password"
            name="userpwConfirm"
            value={form.userpwConfirm}
            onChange={handleChange}
            placeholder="비밀번호 확인"
          />
        </label>

        <label>
          이름
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="이름"
          />
        </label>

        <label>
          닉네임
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="닉네임"
          />
        </label>

        <label>
          이메일
          <div className="input-button-row">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="test@test.com"
            />

            <button
              type="button"
              className="secondary-button"
              onClick={handleEmailCheck}
            >
              중복확인
            </button>
          </div>
        </label>

        {emailChecked && (
          <p className="success-text">사용 가능한 이메일입니다.</p>
        )}

        <button className="primary-button full-button" disabled={loading}>
          {loading ? "처리 중..." : "회원가입"}
        </button>

        <p className="auth-link">
          이미 회원이신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
