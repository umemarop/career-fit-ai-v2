import { Router } from "express";
import {
  analyzeGuestJobController,
  analyzeJobForUserController,
  getMyJobAnalysesController,
  getJobAnalysisByIdController,
} from "./jobAnalysis.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createGuestJobAnalysisSchema,
  createUserJobAnalysisSchema,
  getMyJobAnalysesSchema,
  getJobAnalysisByIdSchema,
} from "./jobAnalysis.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/guest",
  validate(createGuestJobAnalysisSchema),
  analyzeGuestJobController,
);
router
  .route("/")
  .get(protect, validate(getMyJobAnalysesSchema), getMyJobAnalysesController)
  .post(
    protect,
    validate(createUserJobAnalysisSchema),
    analyzeJobForUserController,
  );

router
  .route("/:id")
  .get(
    protect,
    validate(getJobAnalysisByIdSchema),
    getJobAnalysisByIdController,
  );

export default router;
