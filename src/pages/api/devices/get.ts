import { HttpException, NotFoundException } from "nextlove"
import { z } from "zod"

import { device } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getManagedDevicesWithFilter } from "lib/util/devices.ts"

export const common_params = z
  .object({
    device_id: z.string().optional(),
    name: z.string().optional(),
  })
  .refine(
    (args) => Boolean(args.device_id) || Boolean(args.name),
    "Either 'device_id' or 'name' is required",
  )

export default withRouteSpec({
  auth: ["cst_ak_pk"],
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
    device,
  }),
} as const)(async (req, res) => {
  const { device_id, name } = req.commonParams
  const { workspace_id } = req.auth

  const device = getManagedDevicesWithFilter(req.db, {
    workspace_id,
    device_id,
    name,
  })[0]

  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
    })
  }

  if (req.auth.type === "client_session") {
    if (
      !req.auth.connected_account_ids.includes(
        device.connected_account_id ?? "",
      )
    ) {
      throw new HttpException(401, {
        type: "unauthorized",
        message: "Not authorized to view this device",
      })
    }
  }

  res.status(200).json({ device })
})
