import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { climate_setting } from "lib/zod/climate_setting.ts"
import { climate_setting_schedule } from "lib/zod/climate_setting_schedule.ts"
import { timestamp } from "lib/zod/common.ts"

const jsonBody = z
  .object({
    schedule_type: z.literal("time_bound").default("time_bound"),
    device_id: z.string(),
    name: z.string().optional(),
    schedule_starts_at: timestamp,
    schedule_ends_at: timestamp,
  })
  .merge(climate_setting.partial())
  .refine((value) => {
    if (Boolean(value.schedule_starts_at) && Boolean(value.schedule_ends_at)) {
      const schedule_starts_at = new Date(value.schedule_starts_at).getTime()
      const schedule_ends_at = new Date(value.schedule_ends_at).getTime()

      return schedule_starts_at < schedule_ends_at
    }
    return true
  }, "schedule_starts_at must be before schedule_ends_at")
  .refine(
    (value) => value.manual_override_allowed !== undefined,
    "manual_override_allowed must be provided"
  )

export default withRouteSpec({
  methods: ["POST"],
  auth: "cst_ak_pk",
  jsonBody,
  jsonResponse: z.object({
    climate_setting_schedule,
  }),
} as const)(async (req, res) => {
  const {
    schedule_type,
    name,
    device_id,
    schedule_starts_at,
    schedule_ends_at,
  } = req.body
  const climate_setting_for_schedule = climate_setting.partial().parse(req.body)

  const climate_setting_schedule = req.db.addClimateSettingSchedule({
    workspace_id: req.auth.workspace_id,
    schedule_type,
    device_id,
    name: name ?? "Schedule ${randomUUID().slice(5)}",
    schedule_starts_at: new Date(schedule_starts_at).toISOString(),
    schedule_ends_at: new Date(schedule_ends_at).toISOString(),
    ...climate_setting_for_schedule,
  })

  res.status(200).json({
    climate_setting_schedule,
  })
})
