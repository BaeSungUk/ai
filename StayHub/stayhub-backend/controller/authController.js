import {
  checkEmail as checkEmailService,
  getMyInfo,
  login as loginService,
  signup as signupService,
} from "../service/authService.js";

import asyncHandler from "../util/asyncHandler.js";

import { sendSuccess } from "../util/response.js";

export const signup = asyncHandler(async (req, res) => {
  const user = await signupService(req.body);

  return sendSuccess(res, 201, "회원가입에 성공했습니다.", user);
});

export const checkEmail = asyncHandler(async (req, res) => {
  const result = await checkEmailService(req.query.email);

  const message = result.available
    ? "사용 가능한 이메일입니다."
    : "이미 사용 중인 이메일입니다.";

  return sendSuccess(res, 200, message, result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginService(req.body);

  return sendSuccess(res, 200, "로그인에 성공했습니다.", result);
});

export const me = asyncHandler(async (req, res) => {
  const user = await getMyInfo(req.user._id);

  return sendSuccess(res, 200, "회원 정보를 조회했습니다.", user);
});
