import { HttpException, NotFoundException } from "nextlove"
import { z } from "zod"

import {    device,
  LOCK_DEVICE_TYPES} from "lib/zod/index.ts";
import type {LockDeviceType} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

import { common_params } from "../devices/get.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
    lock: device,
    device,
  }),
} as const)(async (req, res) => {
  const { device_id, name } = req.commonParams

  const device = req.db.devices.find(
    (d) =>
      (d.device_id === device_id || d.properties.name === name) &&
      LOCK_DEVICE_TYPES.includes(d.device_type as LockDeviceType)
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

  res.status(200).json({ lock: device, device })
})
