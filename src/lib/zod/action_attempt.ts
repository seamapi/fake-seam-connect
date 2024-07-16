import { z } from "zod"

export const action_attempt = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    action_type: z.string(),
    action_attempt_id: z.string(),
    result: z.any(),
    error: z.null(),
  }),
  z.object({
    status: z.literal("pending"),
    action_type: z.string(),
    action_attempt_id: z.string(),
    result: z.null(),
    error: z.null(),
  }),
  z.object({
    status: z.literal("error"),
    action_type: z.string(),
    action_attempt_id: z.string(),
    result: z.null(),
    error: z.object({
      type: z.string(),
      message: z.string(),
    }),
  }),
])

export type ActionAttempt = z.infer<typeof action_attempt>
