import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { getUserSessions, revokeSessionById } from "./session.service.js";
import type { RevokeSessionParams } from "./session.validation.js";

export const getMySessions = catchAsync(async (req: Request, res: Response) => {
  const sessions = await getUserSessions(req.user!.id, req.user!.sessionId);

  res.status(200).json({
    status: "success",
    results: sessions.length,
    data: {
      sessions,
    },
  });
});

export const revokeMySession = catchAsync(
  async (req: Request, res: Response) => {
    const { sessionId } = req.validated!.params as RevokeSessionParams;

    await revokeSessionById(req.user!.id, sessionId);

    res.status(204).send();
  },
);
