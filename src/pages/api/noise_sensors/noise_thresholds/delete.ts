import { NotFoundException } from "nextlove"
import { z } from "zod"

import {
  action_attempt,
  NOISE_SENSOR_DEVICE_TYPES,
  type NoiseSensorDeviceType,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getManagedDevicesWithFilter } from "lib/util/devices.ts"

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["DELETE", "POST"],
  jsonBody: z.object({
    noise_threshold_id: z.string(),
    device_id: z.string(),
    sync: z.boolean().default(false),
  }),
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { device_id, sync, noise_threshold_id } = req.body
  const { workspace_id } = req.auth

  const device = getManagedDevicesWithFilter(req.db, {
    workspace_id,
    device_id,
  })[0]

  if (
    device == null ||
    !NOISE_SENSOR_DEVICE_TYPES.includes(
      device.device_type as NoiseSensorDeviceType,
    )
  ) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "DELETE_NOISE_THRESHOLD",
  })
  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  req.db.deleteNoiseThreshold({ device_id, noise_threshold_id })

  res
    .status(200)
    .json({ action_attempt: sync ? action_attempt_sync : action_attempt })
})
