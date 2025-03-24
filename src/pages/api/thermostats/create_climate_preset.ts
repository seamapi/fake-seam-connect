import type { Device } from "@seamapi/types/connect"
import { BadRequestException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { normalizeClimateSetting, returnOrThrowIfNotThermostatDevice, throwIfClimateSettingNotAllowed } from "lib/util/thermostats.ts"
import { climate_preset, type ClimatePreset } from "lib/zod/climate_preset.ts"

export default withRouteSpec({
  description: `
  ---
  title: Create a Climate Preset
  response_key: null
  ---
  Creates a [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) for a specified [thermostat](https://docs.seam.co/latest/capability-guides/thermostats).
  `,
  methods: ["POST"],
  auth: ["pat_with_workspace", "console_session_with_workspace", "api_key"],
  jsonBody: z
    .object({
      device_id: z
        .string()
        .uuid()
        .describe("ID of the desired thermostat device."),
    })
    .merge(
      climate_preset.omit({
        can_edit: true,
        can_delete: true,
        display_name: true,
        manual_override_allowed: true,
      })
    ),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const {
    body: { device_id, ...draft_climate_preset },
  } = req

  const climate_preset = normalizeClimateSetting({
    ...draft_climate_preset,
    can_edit: true,
    can_delete: true,
  }) as ClimatePreset

  const { properties } = returnOrThrowIfNotThermostatDevice(req, device_id);

  throwIfClimateSettingNotAllowed(climate_preset, properties as unknown as Device["properties"])

  const available_climate_presets = properties.available_climate_presets ?? []

  if (
    available_climate_presets.some(
      (preset) =>
        preset.climate_preset_key === climate_preset.climate_preset_key
    )
  ) {
    throw new BadRequestException({
      type: "climate_preset_exists",
      message: `A climate preset with the key '${climate_preset.climate_preset_key}' already exists`,
    })
  }
  available_climate_presets.push(climate_preset)

  req.db.updateDevice({
    device_id,
    properties: {
      ...properties,
      available_climate_presets,
    },
  })

  res.status(200).json({})
})