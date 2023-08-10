import { z } from "zod"

export const climate_setting = z.object({
  automatic_heating_enabled: z.boolean(),
  automatic_cooling_enabled: z.boolean(),
  hvac_mode_setting: z.enum(["off", "heat", "cool", "heatcool"]),
  cooling_set_point_celsius: z.number().optional(),
  heating_set_point_celsius: z.number().optional(),
  cooling_set_point_fahrenheit: z.number().optional(),
  heating_set_point_fahrenheit: z.number().optional(),
  manual_override_allowed: z.boolean(),
})

export type ClimateSetting = z.infer<typeof climate_setting>
