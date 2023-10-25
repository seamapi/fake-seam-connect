import { BadRequestException, HttpException, NotFoundException } from "nextlove"
import { z } from "zod"

import {
  action_attempt,
  THERMOSTAT_DEVICE_TYPES,
  ThermostatDeviceType,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { convertToCelsius, convertToFahrenheit } from "lib/util/thermostats.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  jsonBody: z
    .object({
      device_id: z.string(),
      heating_set_point_celsius: z.number().optional(),
      heating_set_point_fahrenheit: z.number().optional(),
      cooling_set_point_celsius: z.number().optional(),
      cooling_set_point_fahrenheit: z.number().optional(),
      sync: z.boolean().default(false),
    })
    .refine(
      ({
        heating_set_point_celsius,
        heating_set_point_fahrenheit,
        cooling_set_point_celsius,
        cooling_set_point_fahrenheit,
      }) => {
        const cooling_set_point =
          cooling_set_point_celsius ?? cooling_set_point_fahrenheit
        const heating_set_point =
          heating_set_point_celsius ?? heating_set_point_fahrenheit

        return (
          cooling_set_point !== undefined && heating_set_point !== undefined
        )
      },
      "You must set both a heating setpoint and a cooling setpoint"
    )
    .refine(({ heating_set_point_celsius, heating_set_point_fahrenheit }) => {
      if (
        heating_set_point_celsius != null &&
        heating_set_point_fahrenheit != null
      ) {
        return false
      }
      return true
    }, "You cannot set both heating_set_point_celsius and heating_set_point_fahrenheit")
    .refine(({ cooling_set_point_celsius, cooling_set_point_fahrenheit }) => {
      if (
        cooling_set_point_celsius != null &&
        cooling_set_point_fahrenheit != null
      ) {
        return false
      }
      return true
    }, "You cannot set both cooling_set_point_celsius and cooling_set_point_fahrenheit"),
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const {
    device_id,
    heating_set_point_celsius,
    heating_set_point_fahrenheit,
    cooling_set_point_celsius,
    cooling_set_point_fahrenheit,
    sync,
  } = req.body

  const device = req.db.devices.find((device) => {
    if (
      !THERMOSTAT_DEVICE_TYPES.includes(
        device.device_type as ThermostatDeviceType
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

  const cooling_set_point =
    cooling_set_point_celsius ??
    (cooling_set_point_fahrenheit != null
      ? convertToCelsius(cooling_set_point_fahrenheit)
      : undefined)

  if (heating_set_point == null) {
    throw new HttpException(500, {
      type: "heating_set_point_undefined",
      message: "heating_set_point is undefined",
    })
  }

  if (cooling_set_point == null) {
    throw new HttpException(500, {
      type: "cooling_set_point_undefined",
      message: "cooling_set_point is undefined",
    })
  }

  if (
    device.properties == null ||
    !("is_heating_available" in device.properties) ||
    !device.properties.is_heating_available ||
    !device.properties.is_cooling_available
  ) {
    throw new HttpException(500, {
      type: "heat_cool_not_available",
      message: `'heat' mode is not available for this thermostat`,
    })
  }

  const { min_heating_cooling_delta_celsius } = device.properties

  if (
    min_heating_cooling_delta_celsius != null &&
    Math.abs(heating_set_point - cooling_set_point) <
      min_heating_cooling_delta_celsius
  ) {
    throw new BadRequestException({
      type: "invalid_heating_cooling_delta",
      message: `Difference between set points must be more than ${min_heating_cooling_delta_celsius}°C/${convertToFahrenheit(
        min_heating_cooling_delta_celsius
      )}°F  for this thermostat`,
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "SET_HEAT_COOL",
  })

  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  res.status(200).json({
    action_attempt: sync ? action_attempt_sync : action_attempt,
  })
})
