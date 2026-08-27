export function notFound(req, res) {
  res
    .status(404)
    .json({ success: false, message: "요청한 경로를 찾을 수 없습니다." });
}
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  res
    .status(error.statusCode || 500)
    .json({
      success: false,
      message: error.statusCode ? error.message : "서버 오류가 발생했습니다.",
    });
}
