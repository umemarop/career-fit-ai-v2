import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import * as adminService from "./admin.service.js";

import type {
  GetAdminUsersQuery,
  GetAdminUserByIdParams,
  UpdateAdminUserRoleParams,
  UpdateAdminUserRoleInput,
  UpdateAdminUserStatusParams,
  UpdateAdminUserStatusInput,
} from "./admin.validation.js";

export const getAdminStats = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await adminService.getAdminStats();

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const getAdminUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.validated?.query as GetAdminUsersQuery;

  const result = await adminService.getAdminUsers(query);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

export const getAdminUserById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.validated?.params as GetAdminUserByIdParams;

    const result = await adminService.getAdminUserById(id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const updateAdminUserRole = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.validated?.params as UpdateAdminUserRoleParams;
    const input = req.validated?.body as UpdateAdminUserRoleInput;

    const result = await adminService.updateAdminUserRole(
      req.user!.id,
      id,
      input,
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const updateAdminUserStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.validated?.params as UpdateAdminUserStatusParams;
    const input = req.validated?.body as UpdateAdminUserStatusInput;

    const result = await adminService.updateAdminUserStatus(
      req.user!.id,
      id,
      input,
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);
