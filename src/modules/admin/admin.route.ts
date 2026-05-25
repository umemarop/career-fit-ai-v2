import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireEmailVerified } from "../../middlewares/requireEmailVerified.middleware.js";
import { restrictTo } from "../../middlewares/restrictTo.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  getAdminStats,
  getAdminUserById,
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "./admin.controller.js";
import {
  getAdminUserByIdSchema,
  getAdminUsersSchema,
  updateAdminUserRoleSchema,
  updateAdminUserStatusSchema,
} from "./admin.validation.js";

const router = Router();

router.use(protect);
router.use(requireEmailVerified);
router.use(restrictTo("ADMIN"));

router.get("/stats", getAdminStats);

router.get("/users", validate(getAdminUsersSchema), getAdminUsers);

router.get("/users/:id", validate(getAdminUserByIdSchema), getAdminUserById);

router.patch(
  "/users/:id/role",
  validate(updateAdminUserRoleSchema),
  updateAdminUserRole,
);

router.patch(
  "/users/:id/status",
  validate(updateAdminUserStatusSchema),
  updateAdminUserStatus,
);

export default router;
