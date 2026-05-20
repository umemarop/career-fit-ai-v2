import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  register,
  login,
  getMe,
  refreshToken,
  logout,
  logoutOthers,
  logoutAll,
} from "./auth.controller.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from "./auth.validation.js";

import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/logout", validate(logoutSchema), logout);

router.post("/logout-others", protect, logoutOthers);

router.post("/logout-all", protect, logoutAll);

router.post("/refresh", validate(refreshTokenSchema), refreshToken);

router.get("/me", protect, getMe);

export default router;
