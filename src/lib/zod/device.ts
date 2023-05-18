import { z } from "zod"

export const deviceType = z.enum([
  "august_lock",
  "schlage_lock",
  "yale_lock",
  "smartthings_lock",
])

export const common_device_properties = z.object({
  online: z.boolean(),
  name: z.string(),
})

export const lock_device_properties = common_device_properties.extend({
  locked: z.boolean(),
  door_open: z.boolean().optional(),
  battery_level: z.number().optional(),
  schlage_metadata: z
    .object({
      device_id: z.string(),
      device_name: z.string(),
    })
    .optional(),
  august_metadata: z
    .object({
      lock_id: z.string(),
      lock_name: z.string(),
      house_name: z.string(),
    })
    .optional(),
})

export const device = z.object({
  device_id: z.string(),
  device_type: deviceType,
  capabilities_supported: z.array(z.string()),
  properties: z.union([common_device_properties, lock_device_properties]),
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

export type Device = z.infer<typeof device>
export type UnmanagedDevice = z.infer<typeof unmanaged_device>
