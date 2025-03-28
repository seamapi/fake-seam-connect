import _ from "lodash"
import { BadRequestException } from "nextlove"
import { z } from "zod"

import {
  type RouteSpecRequest,
  withRouteSpec,
} from "lib/middleware/with-route-spec.ts"
import { returnOrThrowIfNotThermostatDevice } from "lib/util/thermostats.ts"

export default withRouteSpec({
  description: `
  ---
  title: Delete a Climate Preset
  response_key: null
  ---
  Deletes a specified [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) for a specified [thermostat](https://docs.seam.co/latest/capability-guides/thermostats).
  `,
  methods: ["POST", "DELETE"],
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  jsonBody: z.object({
    device_id: z
      .string()
      .describe("ID of the desired thermostat device."),
    climate_preset_key: z
      .string()
      .describe("Climate preset key of the desired climate preset."),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const {
    body: { device_id, climate_preset_key },
  } = req

  const { properties } = returnOrThrowIfNotThermostatDevice(
    req as RouteSpecRequest,
    device_id,
  )

  const climatePresetExists = properties.available_climate_presets.some(
    (preset) => preset.climate_preset_key === climate_preset_key,
  )

  if (!climatePresetExists) {
    throw new BadRequestException({
      type: "climate_preset_not_found",
      message: `Cannot find a climate preset with key ${climate_preset_key}`,
    })
  }

  const climatePresetIsUsed =
    properties.current_climate_setting != null &&
    properties.current_climate_setting.climate_preset_key === climate_preset_key

  if (climatePresetIsUsed) {
    throw new BadRequestException({
      type: "climate_preset_is_scheduled",
      message: `The climate preset with key ${climate_preset_key} is currently in use and cannot be deleted`,
      data: {
        schedules_using_climate_preset: [
          _.pick(properties.active_thermostat_schedule, [
            "ends_at",
            "starts_at",
            "thermostat_schedule_id",
          ]),
        ],
      },
    })
  }

  req.db.updateDevice({
    device_id,
    properties: {
      ...properties,
      available_climate_presets: properties.available_climate_presets.filter(
        (preset) =>
          !preset.can_edit ||
          !preset.can_delete ||
          preset.climate_preset_key !== climate_preset_key,
      ),
    },
  })

  res.status(200).json({})
})
