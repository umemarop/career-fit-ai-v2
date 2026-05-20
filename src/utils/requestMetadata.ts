import type { Request } from "express";
import { UAParser } from "ua-parser-js";

export type RequestMetadata = {
  userAgent: string | undefined;
  ipAddress: string | undefined;
  browser: string | undefined;
  os: string | undefined;
  deviceType: string | undefined;
};

export const getRequestMetadata = (req: Request): RequestMetadata => {
  const userAgent = req.get("user-agent") ?? undefined;

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const ipAddress = req.ip || req.socket.remoteAddress || undefined;

  return {
    userAgent,
    ipAddress,
    browser: result.browser.name,
    os: result.os.name,
    deviceType: result.device.type ?? "desktop",
  };
};
