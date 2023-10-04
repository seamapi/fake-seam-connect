import { z } from "zod"

import { device } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    device_ids: z.array(z.string()).optional(),
  }),
  jsonResponse: z.object({
    devices: z.array(device),
  }),
} as const)(async (req, res) => {
  const { commonParams } = req
  res.status(200).json({
    devices: req.db.devices
      .filter((d) =>
        req.auth.auth_mode === "client_session_token"
          ? req.auth.connected_account_ids.includes(d.connected_account_id)
          : true
      )
      .filter((d) => d.workspace_id === req.auth.workspace_id)
      .filter((d) =>
        commonParams.device_ids == null
          ? true
          : commonParams.device_ids.includes(d.device_id)
      ),
  })
})
