import { Router } from "express";
import * as c from "../controllers/reviewController.js";
import { asyncHandler as a } from "../utils/asyncHandler.js";
import { authenticate } from "../middleware/authMiddleware.js";
const r = Router();
r.post("/", authenticate, a(c.create));
r.delete("/:reviewId", authenticate, a(c.remove));
export default r;
