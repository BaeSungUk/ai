import * as s from "../services/hotelService.js";
import { sendSuccess as ok } from "../utils/response.js";
export const list = async (q, r) =>
  ok(r, 200, "호텔 목록 조회 성공", await s.listHotels(q.query));
export const get = async (q, r) =>
  ok(r, 200, "호텔 조회 성공", await s.getHotel(q.params.hotelId));
export const create = async (q, r) =>
  ok(r, 201, "호텔 등록 성공", await s.createHotel(q.body));
export const update = async (q, r) =>
  ok(r, 200, "호텔 수정 성공", await s.updateHotel(q.params.hotelId, q.body));
export const remove = async (q, r) =>
  ok(r, 200, "호텔 삭제 성공", await s.deleteHotel(q.params.hotelId));
