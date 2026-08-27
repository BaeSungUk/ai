import { Router } from "express";
import * as c from "../controllers/authController.js";
import { asyncHandler as a } from "../utils/asyncHandler.js";
const r = Router();
r.post("/signup", a(c.signup));
r.post("/login", a(c.login));
r.get("/check-email", a(c.checkEmail));
export default r;
