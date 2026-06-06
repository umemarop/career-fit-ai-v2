import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  getMyAiUsageController,
  getPublicAiUsageController,
} from "./aiUsage.controller.js";

const router = Router();

router.get("/public", getPublicAiUsageController);

router.get("/me", protect, getMyAiUsageController);

export default router;
