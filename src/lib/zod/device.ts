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
  battery: z
    .object({
      level: z.number(),
      status: z.enum(["critical", "low", "good", "full"]),
    })
    .optional(),
  image_url: z.string().optional(),
})

export const lock_device_properties = common_device_properties.extend({
  locked: z.boolean(),
  door_open: z.boolean().optional(),
  battery_level: z.number().optional(),
  has_direct_power: z.boolean().optional(),
  manufacturer: z.string().optional(),
  supported_code_lengths: z.array(z.number()).optional(),
  max_active_codes_supported: z.number().optional(),
  serial_number: z.string().optional(),
  schlage_metadata: z
    .object({
      device_id: z.string(),
      device_name: z.string(),
      access_code_length: z.number(),
      model: z.string().optional(),
      location_id: z.string().optional(),
    })
    .optional(),
  august_metadata: z
    .object({
      lock_id: z.string(),
      lock_name: z.string(),
      house_name: z.string(),
      has_keypad: z.boolean().optional(),
      model: z.string().optional(),
      keypad_battery_level: z.string().optional(),
    })
    .optional(),
  nuki_metadata: z
    .object({
      keypad_battery_critical: z.boolean().optional(),
    })
    .optional(),
  smartthings_metadata: z.any().optional(),
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

export const unmanaged_device = device
  .pick({
    device_id: true,
    device_type: true,
    connected_account_id: true,
    workspace_id: true,
    errors: true,
    warnings: true,
    created_at: true,
  })
  .extend({
    properties: z.object({
      name: z.string().optional(),
      manufacturer: z.string().optional(),
      image_url: z.string().optional(),
      image_alt_text: z.string().optional(),
    }),
  })

export type Device = z.infer<typeof device>
export type UnmanagedDevice = z.infer<typeof unmanaged_device>
