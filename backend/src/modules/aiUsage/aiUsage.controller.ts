import type { Request, Response } from "express";
import { AiUsageType } from "../../generated/prisma/enums.js";
import { getAiUsageSummary } from "../../services/ai-usage.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";

export const getPublicAiUsageController = catchAsync(
  async (req: Request, res: Response) => {
    const ipAddress = req.ip;

    if (!ipAddress) {
      throw new AppError("IP address is required.", 400);
    }

    const usage = await getAiUsageSummary({
      ipAddress: req.ip,
      type: AiUsageType.JOB_ANALYSIS,
    });

    res.status(200).json({
      status: "success",
      data: usage,
    });
  },
);

export const getMyAiUsageController = catchAsync(
  async (req: Request, res: Response) => {
    const [jobAnalysis, resumeAutofill] = await Promise.all([
      getAiUsageSummary({
        userId: req.user!.id,
        type: AiUsageType.JOB_ANALYSIS,
      }),
      getAiUsageSummary({
        userId: req.user!.id,
        type: AiUsageType.RESUME_AUTOFILL,
      }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        jobAnalysis: {
          limit: jobAnalysis.limit,
          used: jobAnalysis.used,
          remaining: jobAnalysis.remaining,
        },
        resumeAutofill: {
          limit: resumeAutofill.limit,
          used: resumeAutofill.used,
          remaining: resumeAutofill.remaining,
        },
      },
    });
  },
);
