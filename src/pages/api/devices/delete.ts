import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["DELETE", "POST"],
  commonParams: z.object({
    device_id: z.string(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { device_id } = req.commonParams

  const device = req.db.devices.find((d) => d.device_id === device_id)

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
    })
  }

  const device_access_codes = req.db.access_codes.filter(
    (ac) => ac.device_id === device_id
  )
  for (const access_code of device_access_codes) {
    req.db.deleteAccessCode(access_code)
  }

  const device_climate_setting_schedules =
    req.db.climate_setting_schedules.filter(
      (climate_setting) => climate_setting.device_id === device_id
    )
  for (const climate_setting_schedule of device_climate_setting_schedules) {
    req.db.deleteClimateSettingSchedule(climate_setting_schedule)
  }

  req.db.deleteDevice(device)

  res.status(200).json({})
})
