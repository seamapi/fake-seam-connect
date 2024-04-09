import { z } from "zod"

import { climate_setting } from "lib/zod/climate_setting.ts"
import { climate_setting_schedule } from "lib/zod/climate_setting_schedule.ts"
import { custom_metadata } from "lib/zod/custom-metadata.ts"

export const LOCK_DEVICE_TYPES = [
  "august_lock",
  "schlage_lock",
  "yale_lock",
  "smartthings_lock",
] as const
export type LockDeviceType = (typeof LOCK_DEVICE_TYPES)[number]

export const THERMOSTAT_DEVICE_TYPES = [
  "nest_thermostat",
  "ecobee_thermostat",
] as const
export type ThermostatDeviceType = (typeof THERMOSTAT_DEVICE_TYPES)[number]

export const NOISE_SENSOR_DEVICE_TYPES = [
  "minut_sensor",
  "noiseaware_activity_zone",
] as const
export type NoiseSensorDeviceType = (typeof NOISE_SENSOR_DEVICE_TYPES)[number]

export const PHONE_DEVICE_TYPES = ["ios_phone", "android_phone"] as const
export type PhoneDeviceType = (typeof PHONE_DEVICE_TYPES)[number]

export const device_type = z.union([
  z.enum(LOCK_DEVICE_TYPES),
  z.enum(THERMOSTAT_DEVICE_TYPES),
  z.enum(NOISE_SENSOR_DEVICE_TYPES),
  z.enum(PHONE_DEVICE_TYPES),
])

export const common_device_properties = z.object({
  online: z.boolean(),
  name: z.string(),
  appearance: z.object({
    name: z.string(),
  }),
  model: z.object({
    display_name: z.string(),
    manufacturer_display_name: z.string(),
  }),
  manufacturer: z.string().optional(),
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

export const fan_mode_setting = z.enum(["auto", "on"])

export const thermostat_device_properties = common_device_properties.extend({
  temperature_fahrenheit: z.number(),
  temperature_celsius: z.number(),
  relative_humidity: z.number(),
  can_enable_automatic_heating: z.boolean(),
  can_enable_automatic_cooling: z.boolean(),
  available_hvac_mode_settings: z.enum(["heat", "cool", "heat_cool", "off"]),
  is_heating: z.boolean(),
  is_cooling: z.boolean(),
  is_fan_running: z.boolean(),
  is_temporary_manual_override_active: z.boolean(),
  current_climate_setting: climate_setting,
  default_climate_setting: z.optional(climate_setting),
  is_climate_setting_schedule_active: z.boolean(),
  active_climate_setting_schedule: z.optional(climate_setting_schedule),
  fan_mode_setting,

  is_cooling_available: z.boolean(),
  min_cooling_set_point_celsius: z.number(),
  min_cooling_set_point_fahrenheit: z.number(),
  max_cooling_set_point_celsius: z.number(),
  max_cooling_set_point_fahrenheit: z.number(),

  is_heating_available: z.boolean(),
  min_heating_set_point_celsius: z.number(),
  min_heating_set_point_fahrenheit: z.number(),
  max_heating_set_point_celsius: z.number(),
  max_heating_set_point_fahrenheit: z.number(),

  min_heating_cooling_delta_celsius: z.number(),
  min_heating_cooling_delta_fahrenheit: z.number(),
})

export const device = z.object({
  device_id: z.string(),
  display_name: z.string(),
  device_type,
  capabilities_supported: z.array(z.string()),
  properties: z.union([
    common_device_properties,
    lock_device_properties,
    thermostat_device_properties,
  ]),
  location: z.any(),
  connected_account_id: z.string().optional(),
  is_managed: z.boolean(),
  workspace_id: z.string(),
  errors: z.array(
    z.object({
      error_code: z.string(),
      message: z.string(),
    }),
  ),
  warnings: z.array(
    z.object({
      warning_code: z.string(),
      message: z.string(),
    }),
  ),
  created_at: z.string(),
  custom_metadata,
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
      model: z.object({
        display_name: z.string(),
      }),
    }),
  })

export type Device = z.output<typeof device>
export type UnmanagedDevice = z.infer<typeof unmanaged_device>
