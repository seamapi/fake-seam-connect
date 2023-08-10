import { z } from "zod"

import { climate_setting } from "./climate_setting.ts"

export const climate_setting_schedule = z
  .object({
    climate_setting_schedule_id: z.string().uuid(),
    schedule_type: z.literal("time_bound"),
    device_id: z.string(),
    name: z.string().optional(),
    schedule_starts_at: z.string().datetime(),
    schedule_ends_at: z.string().datetime(),
    created_at: z.string().datetime(),
  })
  .merge(climate_setting.partial())

export type ClimateSettingSchedule = z.infer<typeof climate_setting_schedule>
