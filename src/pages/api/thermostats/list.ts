import { z } from "zod"

import { device, THERMOSTAT_DEVICE_TYPES } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({}),
  jsonResponse: z.object({
    thermostats: z.array(device),
  }),
} as const)(async (req, res) => {
  res.status(200).json({
    thermostats: req.db.devices
      .filter((d) =>
        req.auth.auth_mode === "client_session_token"
          ? req.auth.connected_account_ids.includes(d.connected_account_id)
          : true
      )
      .filter((d) => d.workspace_id === req.auth.workspace_id)
      .filter((d) => THERMOSTAT_DEVICE_TYPES.includes(d.device_type)),
  })
})
