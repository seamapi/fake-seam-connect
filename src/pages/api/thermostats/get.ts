import { NotFoundException } from "nextlove"
import { z } from "zod"

import {
  device,
  THERMOSTAT_DEVICE_TYPES,
  type ThermostatDeviceType,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["GET", "POST"],
  commonParams: z.object({
    device_id: z.string().optional(),
    name: z.string().optional(),
  }),
  jsonResponse: z.object({
    thermostat: device,
  }),
} as const)(async (req, res) => {
  const { device_id, name } = req.commonParams

  const device = req.db.devices.find((device) => {
    if (
      THERMOSTAT_DEVICE_TYPES.includes(
        device.device_type as ThermostatDeviceType,
      )
    ) {
      if (device_id != null) {
        return device.device_id === device_id
      }

      if (name != null) {
        return device.properties.name === name
      }
    }

    return false
  })

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: `Could not find a thermostat with device_id`,
      data: { device_id, name },
    })
  }
  res.status(200).json({ thermostat: device })
})
