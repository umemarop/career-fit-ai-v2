import type { Request, Response, NextFunction } from "express";
import type { RegisterInput, LoginInput } from "./auth.validation.js";
import { registerUser, loginUser, getMeUser } from "./auth.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await registerUser(req.validated?.body as RegisterInput);

    res.status(201).json({
      status: "success",
      data: { user },
    });
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, token } = await loginUser(req.validated?.body as LoginInput);

    res.status(200).json({
      status: "success",
      data: { user, token },
    });
  },
);

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const user = await getMeUser(req.user.id);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  },
);
