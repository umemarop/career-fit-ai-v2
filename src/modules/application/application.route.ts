import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createApplicationController,
  getMyApplicationsController,
  getApplicationByIdController,
  updateApplicationController,
  updateApplicationStatusController,
  deleteApplicationController,
} from "./application.controller.js";

import {
  createApplicationSchema,
  getMyApplicationsSchema,
  getApplicationByIdSchema,
  updateApplicationSchema,
  updateApplicationStatusSchema,
  deleteApplicationSchema,
} from "./application.validation.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .post(validate(createApplicationSchema), createApplicationController)
  .get(validate(getMyApplicationsSchema), getMyApplicationsController);

router.patch(
  "/:id/status",
  validate(updateApplicationStatusSchema),
  updateApplicationStatusController,
);

router
  .route("/:id")
  .get(validate(getApplicationByIdSchema), getApplicationByIdController)
  .patch(validate(updateApplicationSchema), updateApplicationController)
  .delete(validate(deleteApplicationSchema), deleteApplicationController);

export default router;
