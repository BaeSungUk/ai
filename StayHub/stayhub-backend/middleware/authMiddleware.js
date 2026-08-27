import jwt from "jsonwebtoken";

import { findUserById } from "../repository/userRepository.js";

import AppError from "../util/AppError.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new AppError("로그인이 필요합니다.", 401);
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserById(decoded.userId);

    if (!user) {
      throw new AppError("사용자를 찾을 수 없습니다.", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new AppError("유효하지 않거나 만료된 토큰입니다.", 401));
    }

    next(error);
  }
};

export default authMiddleware;
