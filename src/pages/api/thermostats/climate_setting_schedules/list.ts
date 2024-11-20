import { z } from "zod"

import { climate_setting_schedule } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["GET", "POST"],
  commonParams: z.object({
    device_id: z.string(),
  }),
  jsonResponse: z.object({
    climate_setting_schedules: z.array(climate_setting_schedule),
  }),
} as const)(async (req, res) => {
  res.status(200).json({
    climate_setting_schedules: req.db.climate_setting_schedules.filter(
      (schedule) => schedule.device_id === req.commonParams.device_id,
    ),
  })
})
