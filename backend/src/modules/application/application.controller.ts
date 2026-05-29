import type { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from "./application.service.js";

import type {
  CreateApplicationInput,
  GetMyApplicationsQuery,
  GetApplicationByIdParams,
  UpdateApplicationParams,
  UpdateApplicationInput,
  UpdateApplicationStatusInput,
  UpdateApplicationStatusParams,
  DeleteApplicationParams,
} from "./application.validation.js";

export const createApplicationController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const input = req.validated!.body as CreateApplicationInput;
    const result = await createApplication(userId, input);

    res.status(201).json({
      status: "success",
      data: result,
    });
  },
);

export const getMyApplicationsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const query = req.validated!.query as GetMyApplicationsQuery;
    const result = await getMyApplications(userId, query);

    res.status(200).json({
      status: "success",
      data: result.applications,
      meta: result.meta,
    });
  },
);

export const getApplicationByIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { id } = req.validated!.params as GetApplicationByIdParams;
    const result = await getApplicationById(userId, id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const updateApplicationController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { id } = req.validated!.params as UpdateApplicationParams;
    const input = req.validated!.body as UpdateApplicationInput;
    const result = await updateApplication(userId, id, input);

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const updateApplicationStatusController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { id } = req.validated!.params as UpdateApplicationStatusParams;
    const input = req.validated!.body as UpdateApplicationStatusInput;

    const result = await updateApplicationStatus(userId, id, input);

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const deleteApplicationController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { id } = req.validated!.params as DeleteApplicationParams;
    await deleteApplication(userId, id);

    res.status(204).send();
  },
);
