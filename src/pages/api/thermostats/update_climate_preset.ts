import type { Device } from "@seamapi/types/connect"
import { BadRequestException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  normalizeClimateSetting,
  returnOrThrowIfNotThermostatDevice,
  throwIfClimateSettingNotAllowed,
} from "lib/util/thermostats.ts"
import { climate_preset, type ClimatePreset } from "lib/zod/climate_preset.ts"

export default withRouteSpec({
  description: `
  ---
  title: Update a Climate Preset
  response_key: null
  ---
  Updates a specified [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) for a specified [thermostat](https://docs.seam.co/latest/capability-guides/thermostats).
  `,
  methods: ["POST", "PATCH"],
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  jsonBody: z
    .object({
      device_id: z.string().describe("ID of the desired thermostat device."),
    })
    .merge(
      climate_preset.omit({
        can_edit: true,
        can_delete: true,
        display_name: true,
      }),
    ),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const {
    body: { device_id, ...draft_climate_preset },
  } = req

  const { properties } = returnOrThrowIfNotThermostatDevice(req, device_id)

  const existing_climate_preset = properties.available_climate_presets.find(
    (preset) =>
      preset.climate_preset_key === draft_climate_preset.climate_preset_key,
  )

  if (existing_climate_preset == null) {
    throw new BadRequestException({
      type: "climate_preset_not_found",
      message: `Cannot find a climate preset with key ${draft_climate_preset.climate_preset_key}`,
    })
  }

  const climate_preset = normalizeClimateSetting({
    ...existing_climate_preset,
    ...draft_climate_preset,
    can_edit: true,
    can_delete: true,
  }) as ClimatePreset

  throwIfClimateSettingNotAllowed(
    climate_preset,
    properties as unknown as Device["properties"],
  )

  const {
    current_climate_setting: existing_current_climate_setting,
    available_climate_presets: existing_climate_presets,
  } = properties

  const available_climate_presets = existing_climate_presets.filter(
    (preset) =>
      !preset.can_edit ||
      !preset.can_delete ||
      preset.climate_preset_key !== climate_preset.climate_preset_key,
  )

  if (available_climate_presets.length === existing_climate_presets.length) {
    throw new BadRequestException({
      type: "climate_preset_not_found",
      message: `Cannot find a climate preset with key ${climate_preset.climate_preset_key}`,
    })
  }

  const current_climate_setting =
    existing_current_climate_setting?.climate_preset_key ===
    climate_preset.climate_preset_key
      ? climate_preset
      : existing_current_climate_setting

  available_climate_presets.push(climate_preset)

  req.db.updateDevice({
    device_id,
    properties: {
      ...properties,
      current_climate_setting,
      available_climate_presets,
    },
  })

  res.status(200).json({})
})
