import { z } from "zod"
import { seam_tod } from "./seam-tod.ts"

export const noise_threshold = z.object({
  noise_threshold_id: z.string(),
  device_id: z.string(),
  name: z.string(),
  noise_threshold_nrs: z.number().optional(),
  starts_daily_at: seam_tod,
  ends_daily_at: seam_tod,
  noise_threshold_decibels: z.number(),
})

export type NoiseThreshold = z.infer<typeof noise_threshold>
