import express from "express";
import * as authController from "../controller/authController.js";
import auth from "../middleware/auth.js";
import rateLimit from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply stricter rate limit to auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/me", auth, authController.me);

export default router;
