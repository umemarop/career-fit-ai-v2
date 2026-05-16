import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { register, login, getMe } from "./auth.controller.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", protect, getMe);
export default router;
