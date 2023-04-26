import { z } from "zod"
import {
  ALL_LOCK_DEVICE_TYPES,
  ALL_NOISE_SENSOR_TYPES,
} from "lib/locks/constants"

export const deviceType = z.enum([
  ...ALL_LOCK_DEVICE_TYPES,
  ...ALL_NOISE_SENSOR_TYPES,
])

export const device = z.object({
  device_id: z.string(),
  device_type: deviceType,
  capabilities_supported: z.array(z.string()),
  properties: z.object({
    online: z.boolean(),
    name: z.string(),
  }),
  location: z.any(),
  connected_account_id: z.string(),
  workspace_id: z.string(),
  errors: z.array(
    z.object({
      error_code: z.string(),
      message: z.string(),
    })
  ),
  warnings: z.array(
    z.object({
      warning_code: z.string(),
      message: z.string(),
    })
  ),
  created_at: z.string(),
})

export const unmanaged_device = device.pick({
  device_id: true,
  device_type: true,
  connected_account_id: true,
  workspace_id: true,
  errors: true,
  warnings: true,
  created_at: true,
})
