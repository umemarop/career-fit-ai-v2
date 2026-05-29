import type { Request, Response, NextFunction } from "express";
import {
  analyzeGuestJob,
  analyzeJobForUser,
  getMyJobAnalyses as getMyJobAnalysesService,
  getJobAnalysisById,
} from "./jobAnalysis.service.js";
import type {
  CreateUserJobAnalysisInput,
  GetMyJobAnalysesQuery,
  CreateGuestJobAnalysisInput,
  GetJobAnalysisByIdParams,
} from "./jobAnalysis.validation.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";

export const analyzeGuestJobController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { jobDescription } = req.validated!
      .body as CreateGuestJobAnalysisInput;
    const result = await analyzeGuestJob({ jobDescription });
    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const analyzeJobForUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { jobDescription } = req.validated!
      .body as CreateUserJobAnalysisInput;
    const result = await analyzeJobForUser({ userId, jobDescription });
    res.status(201).json({
      status: "success",
      data: result,
    });
  },
);

export const getMyJobAnalysesController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const query = req.validated!.query as GetMyJobAnalysesQuery;
    const result = await getMyJobAnalysesService(userId, query);

    res.status(200).json({
      status: "success",
      data: result.analyses,
      meta: result.meta,
    });
  },
);

export const getJobAnalysisByIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("You are not logged in", 401));
    }

    const { id } = req.validated!.params as GetJobAnalysisByIdParams;

    const result = await getJobAnalysisById(req.user.id, id);

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);
