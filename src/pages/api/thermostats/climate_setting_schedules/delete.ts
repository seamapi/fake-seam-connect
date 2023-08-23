import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const json_body = z.object({
  climate_setting_schedule_id: z.string(),
  sync: z.boolean().default(false),
})

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST", "DELETE"],
  jsonBody: json_body,
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { climate_setting_schedule_id } = req.body

  const climate_setting_schedule = req.db.findClimateSettingSchedule({
    climate_setting_schedule_id,
  })

  if (climate_setting_schedule == null) {
    throw new NotFoundException({
      type: "climate_setting_schedule_not_found",
      message: `Could not find an climate_setting_schedule with climate_setting_schedule_id`,
      data: { climate_setting_schedule_id },
    })
  }

  req.db.deleteClimateSettingSchedule(climate_setting_schedule)

  res.status(200).json({})
})
