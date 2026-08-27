import AppError from "../util/AppError.js";

const notFoundMiddleware = (req, res, next) => {
  next(new AppError("존재하지 않는 API 주소입니다.", 404));
};

export default notFoundMiddleware;
