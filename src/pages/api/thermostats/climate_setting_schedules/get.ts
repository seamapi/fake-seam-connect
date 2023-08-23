import { NotFoundException } from "nextlove"
import { z } from "zod"

import { climate_setting_schedule } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    climate_setting_schedule_id: z.string(),
    device_id: z.string().optional(),
  }),
  jsonResponse: z.object({
    climate_setting_schedule,
  }),
} as const)(async (req, res) => {
  const { device_id, climate_setting_schedule_id } = req.commonParams

  const climate_setting_schedule = req.db.findClimateSettingSchedule({
    climate_setting_schedule_id,
    device_id,
  })

  if (climate_setting_schedule == null) {
    throw new NotFoundException({
      type: "climate_setting_schedule_not_found",
      message: `Could not find an climate_setting_schedule with climate_setting_schedule_id`,
      data: { climate_setting_schedule_id },
    })
  }
  res.status(200).json({ climate_setting_schedule })
})
