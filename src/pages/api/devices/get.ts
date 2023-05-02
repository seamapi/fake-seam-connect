import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { device } from "lib/zod/index.ts"
import { HttpException, NotFoundException } from "nextlove"
import { z } from "zod"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    device_id: z.string(),
  }),
  jsonResponse: z.object({
    device,
  }),
} as const)(async (req, res) => {
  const device = req.db.devices.find(
    (d) => d.device_id === req.commonParams.device_id
  )
  if (!device) {
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
