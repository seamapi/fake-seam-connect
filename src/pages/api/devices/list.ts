import { z } from "zod"

import { device, device_type } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getManagedDevicesWithFilter } from "lib/util/devices.ts"

export const common_params = z.object({
  device_ids: z.array(z.string()).optional(),
  connected_account_id: z.string().optional(),
  connected_account_ids: z.array(z.string()).optional(),
  device_type: device_type.optional(),
  device_types: z.array(device_type).optional(),
  manufacturer: z.string().optional(),
})

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
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

  let devices = getManagedDevicesWithFilter(req.db, {
    workspace_id,
    device_ids,
    connected_account_id,
    connected_account_ids,
    device_type,
    device_types,
    manufacturer,
  })

  if (req.auth.auth_mode === "client_session_token") {
    const auth_connected_account_ids = req.auth.connected_account_ids

    devices = devices.filter((d) =>
      auth_connected_account_ids.includes(d.connected_account_id),
    )
  }

  res.status(200).json({
    devices,
  })
})
