import { z } from "zod"

export const start_end_schedule = z.object({
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
})

export const schedule = start_end_schedule
