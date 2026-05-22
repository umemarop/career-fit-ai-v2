import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
  logoutOthers,
  logoutAll,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
  changePasswordController,
} from "./auth.controller.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "./auth.validation.js";

import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

// Public auth routes
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post(
  "/refresh",
  authLimiter,
  validate(refreshTokenSchema),
  refreshToken,
);
router.get("/verify-email", validate(verifyEmailSchema), verifyEmailController);

router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  forgotPasswordController,
);

router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  resetPasswordController,
);

router.patch(
  "/change-password",
  protect,
  authLimiter,
  validate(changePasswordSchema),
  changePasswordController,
);
// Protected auth routes
router.get("/me", protect, getMe);
router.post("/logout", validate(logoutSchema), logout);
router.post("/logout-others", protect, logoutOthers);
router.post("/logout-all", protect, logoutAll);

export default router;
