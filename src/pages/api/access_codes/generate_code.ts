import { randomInt } from "crypto"
import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["GET", "POST"],
  commonParams: z.object({
    device_id: z.string(),
  }),
  jsonResponse: z.object({
    generated_code: z.object({
      device_id: z.string(),
      code: z.string(),
    }),
  }),
} as const)(async (req, res) => {
  const { device_id } = req.commonParams
  const device = req.db.devices.find((device) => device.device_id === device_id)

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
      data: {
        device_id,
      },
    })
  }

  res.status(200).json({
    generated_code: {
      device_id,
      code: randomInt(1000, 999999).toString(),
    },
  })
})
