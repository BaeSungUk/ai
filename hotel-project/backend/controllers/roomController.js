import * as s from "../services/roomService.js";
import { sendSuccess as ok } from "../utils/response.js";
export const list = async (q, r) =>
  ok(r, 200, "객실 목록 조회 성공", await s.listRooms(q.params.hotelId, q.query));
export const get = async (q, r) =>
  ok(r, 200, "객실 조회 성공", await s.getRoom(q.params.roomId));
export const create = async (q, r) =>
  ok(r, 201, "객실 등록 성공", await s.createRoom(q.body));
export const update = async (q, r) =>
  ok(r, 200, "객실 수정 성공", await s.updateRoom(q.params.roomId, q.body));
export const remove = async (q, r) =>
  ok(r, 200, "객실 삭제 성공", await s.deleteRoom(q.params.roomId));
