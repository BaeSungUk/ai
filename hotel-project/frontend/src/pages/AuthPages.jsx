import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { validateSignup } from "../utils/reservation.js";
const Field = ({ label, error, ...p }) => (
  <label>
    {label}
    <input {...p} />
    {error && <small>{error}</small>}
  </label>
);
export function SignupPage() {
  const [v, setV] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }),
    [errors, setErrors] = useState({}),
    [server, setServer] = useState(""),
    nav = useNavigate();
  const change = (e) => setV({ ...v, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    const x = validateSignup(v);
    setErrors(x);
    if (Object.keys(x).length) return;
    try {
      await authApi.signup(v);
      nav("/login");
    } catch (x) {
      setServer(x.response?.data?.message || "회원가입에 실패했습니다.");
    }
  }
  return (
    <Form title="회원가입" onSubmit={submit} server={server}>
      <Field
        label="이름"
        name="name"
        value={v.name}
        onChange={change}
        error={errors.name}
      />
      <Field
        label="이메일"
        name="email"
        value={v.email}
        onChange={change}
        error={errors.email}
      />
      <Field
        label="비밀번호"
        type="password"
        name="password"
        value={v.password}
        onChange={change}
        error={errors.password}
      />
      <Field
        label="비밀번호 확인"
        type="password"
        name="confirmPassword"
        value={v.confirmPassword}
        onChange={change}
        error={errors.confirmPassword}
      />
      <button>가입하기</button>
      <p>
        이미 회원인가요? <Link to="/login">로그인</Link>
      </p>
    </Form>
  );
}
export function LoginPage() {
  const [v, setV] = useState({ email: "", password: "" }),
    [server, setServer] = useState(""),
    { login } = useAuth(),
    nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    if (!v.email || !v.password)
      return setServer("이메일과 비밀번호를 입력해 주세요.");
    try {
      await login(v);
      nav("/");
    } catch (x) {
      setServer(x.response?.data?.message || "로그인에 실패했습니다.");
    }
  }
  return (
    <Form title="로그인" onSubmit={submit} server={server}>
      <Field
        label="이메일"
        value={v.email}
        onChange={(e) => setV({ ...v, email: e.target.value })}
      />
      <Field
        label="비밀번호"
        type="password"
        value={v.password}
        onChange={(e) => setV({ ...v, password: e.target.value })}
      />
      <button>로그인</button>
    </Form>
  );
}
function Form({ title, onSubmit, server, children }) {
  return (
    <section className="auth">
      <form onSubmit={onSubmit}>
        <h1>{title}</h1>
        {server && <p className="error">{server}</p>}
        {children}
      </form>
    </section>
  );
}
