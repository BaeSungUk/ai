import * as s from "../services/reservationService.js";
import { sendSuccess as ok } from "../utils/response.js";
export const create = async (q, r) =>
  ok(
    r,
    201,
    "예약이 완료되었습니다.",
    await s.createReservation(q.user.userId, q.body),
  );
export const list = async (q, r) =>
  ok(r, 200, "예약 목록 조회 성공", await s.listReservations(q.user.userId));
export const get = async (q, r) =>
  ok(
    r,
    200,
    "예약 조회 성공",
    await s.getReservation(q.user.userId, q.params.reservationId),
  );
export const cancel = async (q, r) =>
  ok(
    r,
    200,
    "예약이 취소되었습니다.",
    await s.cancelReservation(q.user.userId, q.params.reservationId),
  );
