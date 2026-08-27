import {
  createReview as createReviewService,
  deleteReview as deleteReviewService,
  getReviews as getReviewsService,
} from "../service/reviewService.js";

import asyncHandler from "../util/asyncHandler.js";

import { sendSuccess } from "../util/response.js";

export const createReview = asyncHandler(async (req, res) => {
  const review = await createReviewService(
    req.params.hotelId,
    req.body,
    req.user._id,
  );

  return sendSuccess(res, 201, "후기가 등록되었습니다.", review);
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await getReviewsService(req.params.hotelId);

  return sendSuccess(res, 200, "후기 목록을 조회했습니다.", reviews);
});

export const deleteReview = asyncHandler(async (req, res) => {
  await deleteReviewService(req.params.reviewId, req.user._id);

  return sendSuccess(res, 200, "후기가 삭제되었습니다.");
});
