import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
export function authenticate(req, res, next) {
  const value = req.headers.authorization;
  if (!value?.startsWith("Bearer "))
    return next(new ApiError(401, "로그인이 필요합니다."));
  try {
    req.user = jwt.verify(
      value.slice(7),
      process.env.JWT_SECRET || "stayhub_dev_secret",
    );
    next();
  } catch {
    return next(new ApiError(401, "유효하지 않은 인증 토큰입니다."));
  }
}
export const requireAdmin = (req, res, next) =>
  req.user?.role === "admin"
    ? next()
    : next(new ApiError(403, "관리자 권한이 필요합니다."));
