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

const json_body = z
  .object({
    noise_threshold_id: z.string(),
    device_id: z.string(),
    sync: z.boolean().default(false),
    name: z.string().optional(),
    starts_daily_at: seam_tod.optional(),
    ends_daily_at: seam_tod.optional(),
    noise_threshold_decibels: z.number().optional(),
    noise_threshold_nrs: z.number().optional(),
  })
  .refine((value) => {
    const is_starts_provided_but_ends_not =
      value.starts_daily_at != null && value.ends_daily_at == null

    const is_ends_provided_but_starts_not = Boolean(
      value.starts_daily_at == null && value.ends_daily_at != null,
    )
    if (is_starts_provided_but_ends_not || is_ends_provided_but_starts_not) {
      return false
    }
    return true
  }, "Must provide both starts_daily_at or ends_daily_at, if either is provided")
  .refine((value) => {
    if (
      value.noise_threshold_decibels != null &&
      value.noise_threshold_nrs != null
    ) {
      return false
    }
    return true
  }, "Cannot provide both noise_threshold_decibels and noise_threshold_nrs")

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["PATCH", "POST"],
  jsonBody: json_body,
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { device_id, sync, noise_threshold_id, ...noise_threshold } = req.body
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
    action_type: "UPDATE_NOISE_THRESHOLD",
  })
  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  const noise_threshold_update_props = Object.fromEntries(
    Object.entries(noise_threshold).filter(([_, value]) => value !== undefined),
  )
  req.db.updateNoiseThreshold({
    device_id,
    noise_threshold_id,
    ...noise_threshold_update_props,
  })

  res
    .status(200)
    .json({ action_attempt: sync ? action_attempt_sync : action_attempt })
})
