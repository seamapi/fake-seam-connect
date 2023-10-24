import { HttpException, NotFoundException } from "nextlove"
import { z } from "zod"

import { unmanaged_device } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  getManagedDevicesWithFilter,
  getUnmanagedDevicesWithFilter,
} from "lib/util/devices.ts"

import { common_params } from "../get.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
    device: unmanaged_device,
  }),
} as const)(async (req, res) => {
  const { device_id, name } = req.commonParams
  const { workspace_id } = req.auth

  const unmanaged_device = getUnmanagedDevicesWithFilter(req.db, {
    workspace_id,
    device_id,
    name,
  })[0]

  if (unmanaged_device == null) {
    const device = getManagedDevicesWithFilter(req.db, {
      workspace_id,
      device_id,
      name,
    })[0]

    if (device != null) {
      throw new NotFoundException({
        type: "device_not_found",
        message:
          "This device is managed. Convert it to a unmanaged device with /devices/update.",
        data: {
          device_id: device.device_id,
        },
      })
    }

    throw new NotFoundException({
      type: "device_not_found",
      message: "device not found",
      data: {
        device_id,
      },
    })
  }

  if (req.auth.auth_mode === "client_session_token") {
    if (
      !req.auth.connected_account_ids.includes(
        unmanaged_device.connected_account_id
      )
    ) {
      throw new HttpException(401, {
        type: "unauthorized",
        message: "Not authorized to view this device",
      })
    }
  }
  res.status(200).json({ device: unmanaged_device })
})
