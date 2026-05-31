import { Router } from "express";
import {
  analyzeGuestJobController,
  analyzeJobForUserController,
  getMyJobAnalysesController,
  getJobAnalysisByIdController,
} from "./jobAnalysis.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireEmailVerified } from "../../middlewares/requireEmailVerified.middleware.js";
import {
  createGuestJobAnalysisSchema,
  createUserJobAnalysisSchema,
  getMyJobAnalysesSchema,
  getJobAnalysisByIdSchema,
} from "./jobAnalysis.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/public",
  validate(createGuestJobAnalysisSchema),
  analyzeGuestJobController,
);

router.use(protect);
router.use(requireEmailVerified);

router
  .route("/")
  .get(validate(getMyJobAnalysesSchema), getMyJobAnalysesController)
  .post(validate(createUserJobAnalysisSchema), analyzeJobForUserController);

router
  .route("/:id")
  .get(validate(getJobAnalysisByIdSchema), getJobAnalysisByIdController);

export default router;
