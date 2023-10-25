import { NotFoundException } from "nextlove"
import { z } from "zod"

import {
  action_attempt,
  THERMOSTAT_DEVICE_TYPES,
  type ThermostatDeviceType,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z.object({
    device_id: z.string(),
    sync: z.boolean().default(false),
  }),
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { device_id, sync } = req.body

  const device = req.db.devices.find((device) => {
    if (
      THERMOSTAT_DEVICE_TYPES.includes(
        device.device_type as ThermostatDeviceType
      )
    ) {
      if (device_id != null) {
        return device.device_id === device_id
      }
    }

    return false
  })

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: `Could not find a thermostat with device_id`,
      data: { device_id },
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "SET_THERMOSTAT_OFF",
  })

  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  res.status(200).json({
    action_attempt: sync ? action_attempt_sync : action_attempt,
  })
})
