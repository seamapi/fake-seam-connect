import { z } from "zod"

import {
  device,
  LOCK_DEVICE_TYPES,
  type LockDeviceType,
} from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getManagedDevicesWithFilter } from "lib/util/devices.ts"

import { common_params } from "../devices/list.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
    locks: z.array(device),
    devices: z.array(device),
  }),
} as const)(async (req, res) => {
  const {
    device_ids,
    connected_account_id,
    connected_account_ids,
    device_type,
    device_types,
    manufacturer,
  } = req.commonParams
  const { workspace_id } = req.auth

  const devices = getManagedDevicesWithFilter(req.db, {
    workspace_id,
    device_ids,
    connected_account_id,
    connected_account_ids,
    device_type,
    device_types,
    manufacturer,
  }).filter((d) => LOCK_DEVICE_TYPES.includes(d.device_type as LockDeviceType))

  res.status(200).json({ locks: devices, devices })
})
