import { describe, it, expect } from "vitest";
import { bookingSummary, reviewableReservations, validateSignup } from "./reservation.js";
describe("bookingSummary", () => {
  it("calculates three nights and server-facing total", () =>
    expect(bookingSummary("2026-08-10", "2026-08-13", 100000)).toEqual({
      nights: 3,
      totalPrice: 300000,
    }));
  it("rejects reversed dates", () =>
    expect(() => bookingSummary("2026-08-13", "2026-08-10", 100000)).toThrow(
      "체크아웃 날짜는 체크인 날짜 이후여야 합니다.",
    ));
});
describe("signup validation", () => {
  it("reports invalid email, short password and mismatch", () =>
    expect(
      validateSignup({
        name: "길동",
        email: "x",
        password: "123",
        confirmPassword: "12",
      }),
    ).toEqual({
      email: "올바른 이메일 형식이 아닙니다.",
      password: "비밀번호는 6자 이상 입력해 주세요.",
      confirmPassword: "비밀번호가 일치하지 않습니다.",
    }));
});
describe("review reservation choices", () => {
  it("keeps only confirmed reservations for the current hotel", () => {
    const rows = [
      { _id: "a", status: "confirmed", hotel: { _id: "h1" } },
      { _id: "b", status: "cancelled", hotel: { _id: "h1" } },
      { _id: "c", status: "confirmed", hotel: { _id: "h2" } },
    ];
    expect(reviewableReservations(rows, "h1").map((row) => row._id)).toEqual(["a"]);
  });
});
