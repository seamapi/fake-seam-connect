import { HttpException, NotFoundException } from "nextlove"
import { z } from "zod"

import { device } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z
    .object({
      device_id: z.string().optional(),
      name: z.string().optional(),
    })
    .refine(
      (args) => Boolean(args.device_id) || Boolean(args.name),
      "Either 'device_id' or 'name' is required"
    ),
  jsonResponse: z.object({
    device,
  }),
} as const)(async (req, res) => {
  const { device_id, name } = req.commonParams

  const device = req.db.devices.find(
    (d) => d.device_id === device_id || d.properties.name === name
  )
  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
    })
  }
  if (req.auth.auth_mode === "client_session_token") {
    if (!req.auth.connected_account_ids.includes(device.connected_account_id)) {
      throw new HttpException(401, {
        type: "unauthorized",
        message: "Not authorized to view this device",
      })
    }
  }
  res.status(200).json({ device })
})
