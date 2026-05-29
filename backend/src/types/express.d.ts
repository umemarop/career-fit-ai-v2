import type { ValidatedRequestData } from "./validated.js";
import type { AuthUser } from "./auth.ts";
declare global {
  namespace Express {
    interface Request {
      validated?: ValidatedRequestData;
      user?: AuthUser;
    }
  }
}
