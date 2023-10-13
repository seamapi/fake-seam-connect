import { z } from "zod"

import { device, device_type } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    device_ids: z.array(z.string()).optional(),
    connected_account_id: z.string().optional(),
    device_type: device_type.optional(),
    manufacturer: z.string().optional(),
  }),
  jsonResponse: z.object({
    devices: z.array(device),
  }),
} as const)(async (req, res) => {
  const { commonParams } = req
  res.status(200).json({
    devices: req.db.devices.filter(
      (d) =>
        d.workspace_id === req.auth.workspace_id &&
        (req.auth.auth_mode === "client_session_token"
          ? req.auth.connected_account_ids.includes(d.connected_account_id)
          : true) &&
        (commonParams.device_ids == null
          ? true
          : commonParams.device_ids.includes(d.device_id)) &&
        (commonParams.connected_account_id == null
          ? true
          : d.connected_account_id === commonParams.connected_account_id) &&
        (commonParams.device_type == null
          ? true
          : d.device_type === commonParams.device_type) &&
        (commonParams.manufacturer == null
          ? true
          : "manufacturer" in d.properties
          ? d.properties.manufacturer === commonParams.manufacturer
          : false)
    ),
  })
})
