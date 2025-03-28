import { BadRequestException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { returnOrThrowIfNotThermostatDevice } from "lib/util/thermostats.ts"
import { action_attempt } from "lib/zod/action_attempt.ts"

export default withRouteSpec({
  description: `
  ---
  title: Activate a Climate Preset
  response_key: action_attempt
  action_attempt_type: ACTIVATE_CLIMATE_PRESET
  ---
  Activates a specified [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) for a specified [thermostat](https://docs.seam.co/latest/capability-guides/thermostats).
  `,
  methods: ["POST"],
  auth: ["client_session", "pat_with_workspace", "console_session_with_workspace", "api_key"],
  jsonBody: z.object({
    device_id: z
      .string()
      .describe("ID of the desired thermostat device."),
    climate_preset_key: z
      .string()
      .describe("Climate preset key of the desired climate preset."),
  }),
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const {
    body: { device_id, climate_preset_key },
  } = req

  const device = returnOrThrowIfNotThermostatDevice(req, device_id)

  const {
    properties: { available_climate_presets: existing_climate_presets },
  } = device

  const active_climate_preset = existing_climate_presets?.find(
    (preset) => preset.climate_preset_key === climate_preset_key,
  )

  if (active_climate_preset == null) {
    throw new BadRequestException({
      type: "climate_preset_not_found",
      message: "Climate preset not found",
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "ACTIVATE_CLIMATE_PRESET",
    status: "success",
  })

  req.db.updateDevice({
    device_id,
    properties: {
      ...device.properties,
      current_climate_setting: active_climate_preset,
    },
  })

  res.status(200).json({ action_attempt })
})
