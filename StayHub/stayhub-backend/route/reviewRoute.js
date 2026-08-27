import express from "express";

import { deleteReview } from "../controller/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.delete("/:reviewId", authMiddleware, deleteReview);

export default router;
