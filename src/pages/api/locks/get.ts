import { HttpException, NotFoundException } from "nextlove"
import { z } from "zod"

import {
  device,
  LOCK_DEVICE_TYPES,
  type LockDeviceType,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getManagedDevicesWithFilter } from "lib/util/devices.ts"
import { common_params } from "pages/api/devices/get.ts"

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
    lock: device,
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

  if (
    device == null ||
    !LOCK_DEVICE_TYPES.includes(device.device_type as LockDeviceType)
  ) {
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

  res.status(200).json({ lock: device, device })
})
