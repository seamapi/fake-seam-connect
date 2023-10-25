import { NotFoundException } from "nextlove"
import { z } from "zod"

import {
  action_attempt,
  NOISE_SENSOR_DEVICE_TYPES,
  type NoiseSensorDeviceType,
  seam_tod,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getManagedDevicesWithFilter } from "lib/util/devices.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z
    .object({
      device_id: z.string(),
      sync: z.boolean().default(false),
      name: z.string().optional(),
      starts_daily_at: seam_tod,
      ends_daily_at: seam_tod,
      noise_threshold_decibels: z.number().optional(),
      noise_threshold_nrs: z.number().optional(),
    })
    .refine((value) => {
      if (
        value.noise_threshold_decibels == null &&
        value.noise_threshold_nrs == null
      ) {
        return false
      }
      return true
    }, "Must provide either noise_threshold_decibels or noise_threshold_nrs")
    .refine((value) => {
      if (
        value.noise_threshold_decibels != null &&
        value.noise_threshold_nrs != null
      ) {
        return false
      }
      return true
    }, "Cannot provide both noise_threshold_decibels and noise_threshold_nrs"),
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { device_id, sync, ...noise_threshold } = req.body
  const { workspace_id } = req.auth

  const device = getManagedDevicesWithFilter(req.db, {
    workspace_id,
    device_id,
  })[0]

  if (
    device == null ||
    !NOISE_SENSOR_DEVICE_TYPES.includes(
      device.device_type as NoiseSensorDeviceType
    )
  ) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "CREATE_NOISE_THRESHOLD",
  })
  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  req.db.addNoiseThreshold({ device_id, ...noise_threshold })

  res
    .status(200)
    .json({ action_attempt: sync ? action_attempt_sync : action_attempt })
})
