import crypto from "crypto";

export const generateRawToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashAuthToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateAuthTokenPair = () => {
  const rawToken = generateRawToken();
  const tokenHash = hashAuthToken(rawToken);

  return {
    rawToken,
    tokenHash,
  };
};

export const getExpiresAt = (minutes: number): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
