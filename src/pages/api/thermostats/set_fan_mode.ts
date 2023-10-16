import { NotFoundException } from "nextlove"
import { z } from "zod"

import {
  action_attempt,
  fan_mode_setting,
  THERMOSTAT_DEVICE_TYPES,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z.object({
    device_id: z.string(),
    fan_mode_setting,
    sync: z.boolean().default(false),
  }),
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { device_id, sync } = req.body

  const device = req.db.devices.find((device) => {
    if (!THERMOSTAT_DEVICE_TYPES.includes(device.device_type)) {
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

  const action_attempt = req.db.addActionAttempt({
    action_type: "SET_FAN_MODE",
  })

  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  res.status(200).json({
    action_attempt: sync ? action_attempt_sync : action_attempt,
  })
})
