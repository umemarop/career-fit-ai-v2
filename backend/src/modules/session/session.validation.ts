import { z } from "zod";

export const revokeSessionSchema = z.object({
  params: z
    .object({
      sessionId: z.string().uuid("Invalid session id"),
    })
    .strict(),
});

export type RevokeSessionParams = z.infer<typeof revokeSessionSchema>["params"];
