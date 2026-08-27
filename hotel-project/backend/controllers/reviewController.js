import * as s from "../services/reviewService.js";
import { sendSuccess as ok } from "../utils/response.js";
export const create = async (q, r) =>
  ok(
    r,
    201,
    "후기가 등록되었습니다.",
    await s.createReview(q.user.userId, q.body),
  );
export const list = async (q, r) =>
  ok(r, 200, "후기 목록 조회 성공", await s.listReviews(q.params.hotelId));
export const remove = async (q, r) =>
  ok(
    r,
    200,
    "후기가 삭제되었습니다.",
    await s.deleteReview(q.user.userId, q.params.reviewId),
  );
