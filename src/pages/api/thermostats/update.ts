import { NotFoundException } from "nextlove"
import { z } from "zod"

import {
  THERMOSTAT_DEVICE_TYPES,
  type ThermostatDeviceType,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  normalizeClimateSetting,
  refineClimateSetting,
  throwIfClimateSettingNotAllowed,
} from "lib/util/thermostats.ts"
import { climate_setting } from "lib/zod/climate_setting.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["PATCH", "POST"],
  jsonBody: z.object({
    device_id: z.string(),
    default_climate_setting: refineClimateSetting(climate_setting.partial()),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { device_id, default_climate_setting } = req.body

  const device = req.db.devices.find((device) => {
    if (
      !THERMOSTAT_DEVICE_TYPES.includes(
        device.device_type as ThermostatDeviceType,
      )
    ) {
      return false
    }

    return device.device_id === device_id
  })

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: `Could not find a thermostat with device_id`,
      data: { device_id },
    })
  }

  const thermostat_original_climate_setting =
    "default_climate_setting" in device.properties
      ? device.properties.default_climate_setting
      : null

  if (
    thermostat_original_climate_setting == null &&
    default_climate_setting["manual_override_allowed"] == null
  ) {
    throw new Error("manual_override_allowed must be defined")
  }

  const normalized_climate_setting = normalizeClimateSetting({
    ...default_climate_setting,
    manual_override_allowed:
      // eslint-disable-next-line @typescript-eslint/dot-notation
      default_climate_setting["manual_override_allowed"] ??
      thermostat_original_climate_setting?.manual_override_allowed,
  })

  throwIfClimateSettingNotAllowed(normalized_climate_setting, device.properties)

  req.db.updateDevice({
    device_id: device.device_id,
    properties: {
      ...device.properties,
      default_climate_setting: normalized_climate_setting,
    },
  })

  res.status(200).json({})
})
