import { OAuth2Client } from "google-auth-library";

import { env } from "../../config/env.js";
import { AppError } from "../../utils/appError.js";

const googleOAuthClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI,
);

type GoogleTokenResponse = {
  id_token: string | undefined;
  access_token: string | undefined;
};

export type GoogleUserPayload = {
  googleId: string;
  email: string;
  emailVerified: boolean;
  name: string | undefined;
  picture: string | undefined;
};

export const getGoogleAuthUrl = () => {
  return googleOAuthClient.generateAuthUrl({
    access_type: "offline",
    prompt: "select_account",
    scope: ["openid", "email", "profile"],
  });
};

export const exchangeCodeForGoogleTokens = async (
  code: string,
): Promise<GoogleTokenResponse> => {
  const { tokens } = await googleOAuthClient.getToken(code);

  return {
    id_token: tokens.id_token ?? undefined,
    access_token: tokens.access_token ?? undefined,
  };
};

export const verifyGoogleIdToken = async (
  idToken: string,
): Promise<GoogleUserPayload> => {
  const ticket = await googleOAuthClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new AppError("Invalid Google ID token", 401);
  }

  if (!payload.sub) {
    throw new AppError("Google account ID is missing", 401);
  }

  if (!payload.email) {
    throw new AppError("Google email is missing", 401);
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified ?? false,
    name: payload.name,
    picture: payload.picture,
  };
};
