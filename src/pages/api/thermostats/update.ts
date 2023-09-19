import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { climate_setting } from "lib/zod/climate_setting.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z.object({
    device_id: z.string(),
    default_climate_setting: climate_setting.partial(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { device_id, default_climate_setting } = req.body

  const thermostat = req.db.findThermostat({ device_id })

  if (thermostat == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: `Could not find an device with device_id`,
      data: { device_id },
    })
  }

  const thermostat_original_climate_setting =
    thermostat.properties.default_climate_setting

  if (
    thermostat_original_climate_setting === undefined &&
    default_climate_setting.manual_override_allowed === undefined
  )
    throw new Error("manual_override_allowed must be defined")
})
