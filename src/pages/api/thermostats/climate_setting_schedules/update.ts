import { NotFoundException } from "nextlove"
import { z } from "zod"

import { timestamp } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { normalizeClimateSetting } from "lib/util/thermostats.ts"
import { climate_setting } from "lib/zod/climate_setting.ts"
import { climate_setting_schedule } from "lib/zod/climate_setting_schedule.ts"

const jsonBody = z
  .object({
    climate_setting_schedule_id: z.string(),
    schedule_type: z.literal("time_bound").default("time_bound"),
    name: z.string().optional(),
    schedule_starts_at: timestamp.optional(),
    schedule_ends_at: timestamp.optional(),
  })
  .merge(climate_setting.partial())
  .refine((value) => {
    if (value.schedule_starts_at && value.schedule_ends_at) {
      const schedule_starts_at = new Date(value.schedule_starts_at).getTime()
      const schedule_ends_at = new Date(value.schedule_ends_at).getTime()

      return schedule_starts_at < schedule_ends_at
    }
    return true
  }, "schedule_starts_at must be before schedule_ends_at")

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody,
  jsonResponse: z.object({
    climate_setting_schedule,
  }),
} as const)(async (req, res) => {
  const {
    climate_setting_schedule_id,
    schedule_type,
    name,
    schedule_starts_at,
    schedule_ends_at,
  } = req.body

  const climate_setting_schedule = req.db.findClimateSettingSchedule({
    climate_setting_schedule_id,
  })

  const climate_setting_for_schedule = climate_setting.partial().parse(req.body)

  if (climate_setting_schedule == null) {
    throw new NotFoundException({
      type: "climate_setting_schedule_not_found",
      message: `Could not find an climate_setting_schedule with climate_setting_schedule_id`,
      data: { climate_setting_schedule_id },
    })
  }

  const update_object = {
    climate_setting_schedule_id,
    name: name ?? climate_setting_schedule.name,
    schedule_type: schedule_type ?? climate_setting_schedule.schedule_type,
    schedule_starts_at: schedule_starts_at
      ? new Date(schedule_starts_at).toISOString()
      : climate_setting_schedule.schedule_starts_at,
    schedule_ends_at: schedule_ends_at
      ? new Date(schedule_ends_at).toISOString()
      : climate_setting_schedule.schedule_ends_at,
  }

  if (Object.keys(climate_setting_for_schedule).length > 0) {
    Object.assign(
      update_object,
      normalizeClimateSetting(climate_setting_for_schedule)
    )
  }

  const updated = req.db.updateClimateSettingSchedule(update_object)

  res.status(200).json({ climate_setting_schedule: updated })
})
