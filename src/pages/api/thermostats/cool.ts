import { HttpException, NotFoundException } from "nextlove"
import { z } from "zod"

import { action_attempt, THERMOSTAT_DEVICE_TYPES } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { convertToCelsius } from "lib/util/thermostats.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z
    .object({
      device_id: z.string(),
      cooling_set_point_celsius: z.number().optional(),
      cooling_set_point_fahrenheit: z.number().optional(),
      sync: z.boolean().default(false),
    })
    .refine(({ cooling_set_point_celsius, cooling_set_point_fahrenheit }) => {
      if (
        cooling_set_point_celsius == null &&
        cooling_set_point_fahrenheit == null
      ) {
        return false
      }
      return true
    }, "You must set either cooling_set_point_celsius or cooling_set_point_fahrenheit")
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
    cooling_set_point_celsius,
    cooling_set_point_fahrenheit,
    sync,
  } = req.commonParams

  console.log("GOT: ", cooling_set_point_celsius)

  const device = req.db.devices.find((device) => {
    if (!THERMOSTAT_DEVICE_TYPES.includes(device.device_type)) {
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

  const cooling_set_point =
    cooling_set_point_celsius ??
    (cooling_set_point_fahrenheit != null
      ? convertToCelsius(cooling_set_point_fahrenheit)
      : undefined)

  if (cooling_set_point == null) {
    throw new HttpException(500, {
      type: "cooling_set_point_undefined",
      message: "cooling_set_point is undefined",
    })
  }

  if (
    device.properties == null ||
    !("is_cooling_available" in device.properties) ||
    !device.properties.is_cooling_available
  ) {
    console.log(device.properties)
    throw new HttpException(500, {
      type: "cool_mode_not_available",
      message: `'cool' mode is not available for this thermostat`,
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "SET_COOL",
  })

  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  res.status(200).json({
    action_attempt: sync ? action_attempt_sync : action_attempt,
  })
})
