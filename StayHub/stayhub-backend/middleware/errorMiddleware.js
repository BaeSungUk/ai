const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  // MongoDB ObjectId 오류
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "잘못된 데이터 ID입니다.",
      data: null,
    });
  }

  // Mongoose Validation
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message,
      data: null,
    });
  }

  // unique 중복
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "이미 사용 중인 데이터입니다.",
      data: null,
    });
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "서버에서 오류가 발생했습니다.",
    data: null,
  });
};

export default errorMiddleware;
