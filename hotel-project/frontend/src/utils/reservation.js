export function bookingSummary(checkIn, checkOut, price) {
  const a = new Date(`${checkIn}T00:00:00Z`),
    b = new Date(`${checkOut}T00:00:00Z`),
    nights = (b - a) / 86400000;
  if (!checkIn || !checkOut || !Number.isInteger(nights) || nights <= 0)
    throw new Error("체크아웃 날짜는 체크인 날짜 이후여야 합니다.");
  return { nights, totalPrice: Number(price) * nights };
}
export function validateSignup(v) {
  const e = {};
  if (!v.name?.trim()) e.name = "이름을 입력해 주세요.";
  if (!v.email?.trim()) e.email = "이메일을 입력해 주세요.";
  else if (!/^\S+@\S+\.\S+$/.test(v.email))
    e.email = "올바른 이메일 형식이 아닙니다.";
  if (!v.password || v.password.length < 6)
    e.password = "비밀번호는 6자 이상 입력해 주세요.";
  if (v.password !== v.confirmPassword)
    e.confirmPassword = "비밀번호가 일치하지 않습니다.";
  return e;
}
export const money = (v) => `${Number(v || 0).toLocaleString("ko-KR")}원`;
export const reviewableReservations = (rows, hotelId) =>
  rows.filter(
    (row) => row.status === "confirmed" && (row.hotel?._id || row.hotel) === hotelId,
  );
