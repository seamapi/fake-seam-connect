import { HttpException, NotFoundException } from "nextlove"
import { z } from "zod"

import {
  action_attempt,
  THERMOSTAT_DEVICE_TYPES,
  type ThermostatDeviceType,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { convertToCelsius } from "lib/util/thermostats.ts"

export default withRouteSpec({
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  methods: ["GET", "POST"],
  commonParams: z
    .object({
      device_id: z.string(),
      heating_set_point_celsius: z.number().optional(),
      heating_set_point_fahrenheit: z.number().optional(),
      sync: z.boolean().default(false),
    })
    .refine(({ heating_set_point_celsius, heating_set_point_fahrenheit }) => {
      if (
        heating_set_point_celsius == null &&
        heating_set_point_fahrenheit == null
      ) {
        return false
      }
      return true
    }, "You must set either heating_set_point_celsius or heating_set_point_fahrenheit")
    .refine(({ heating_set_point_celsius, heating_set_point_fahrenheit }) => {
      if (
        heating_set_point_celsius != null &&
        heating_set_point_fahrenheit != null
      ) {
        return false
      }
      return true
    }, "You cannot set both heating_set_point_celsius and heating_set_point_fahrenheit"),
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const {
    device_id,
    heating_set_point_celsius,
    heating_set_point_fahrenheit,
    sync,
  } = req.commonParams

  const device = req.db.devices.find((device) => {
    if (
      !THERMOSTAT_DEVICE_TYPES.includes(
        device.device_type as ThermostatDeviceType,
      )
    ) {
      return false
    }

    return device.device_id === device_id
  })

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: `Could not find a thermostat with device_id`,
      data: { device_id },
    })
  }

  const heating_set_point =
    heating_set_point_celsius ??
    (heating_set_point_fahrenheit != null
      ? convertToCelsius(heating_set_point_fahrenheit)
      : undefined)

  if (heating_set_point == null) {
    throw new HttpException(500, {
      type: "heating_set_point_undefined",
      message: "heating_set_point is undefined",
    })
  }

  if (
    device.properties == null ||
    !("is_heating_available" in device.properties) ||
    !device.properties.is_heating_available
  ) {
    throw new HttpException(500, {
      type: "heat_mode_not_available",
      message: `'heat' mode is not available for this thermostat`,
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "SET_HEAT",
  })

  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  req.db.updateDevice({
    device_id,
    properties: {
      ...device.properties,
      current_climate_setting: {
        ...device.properties.current_climate_setting,
        heating_set_point_celsius: heating_set_point,
        hvac_mode_setting: "heat",
      },
    },
  })

  res.status(200).json({
    action_attempt: sync ? action_attempt_sync : action_attempt,
  })
})
