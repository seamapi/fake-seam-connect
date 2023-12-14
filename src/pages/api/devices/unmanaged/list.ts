import { z } from "zod"

import { unmanaged_device } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { getUnmanagedDevicesWithFilter } from "lib/util/devices.ts"
import { common_params } from "pages/api/devices/list.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: common_params,
  jsonResponse: z.object({
    devices: z.array(unmanaged_device),
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

  let devices = getUnmanagedDevicesWithFilter(req.db, {
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
      auth_connected_account_ids.includes(d.connected_account_id)
    )
  }

  res.status(200).json({
    devices,
  })
})
