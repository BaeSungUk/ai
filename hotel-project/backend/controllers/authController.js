import * as service from "../services/authService.js";
import { sendSuccess } from "../utils/response.js";
export const signup = async (req, res) =>
  sendSuccess(
    res,
    201,
    "회원가입이 완료되었습니다.",
    await service.signup(req.body),
  );
export const login = async (req, res) =>
  sendSuccess(
    res,
    200,
    "로그인에 성공했습니다.",
    await service.login(req.body),
  );
export const checkEmail = async (req, res) =>
  sendSuccess(
    res,
    200,
    "이메일 중복 확인이 완료되었습니다.",
    await service.checkEmail(req.query.email),
  );
