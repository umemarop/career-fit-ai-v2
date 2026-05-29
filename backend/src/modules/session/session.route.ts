import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { getMySessions, revokeMySession } from "./session.controller.js";
import { revokeSessionSchema } from "./session.validation.js";

const router = Router();

router.use(protect);

router.get("/", getMySessions);

router.delete("/:sessionId", validate(revokeSessionSchema), revokeMySession);

export default router;
