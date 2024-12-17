import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { acs_system } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  commonParams: z.object({
    connected_account_id: z.string().optional(),
  }),
  jsonResponse: z.object({
    acs_systems: z.array(acs_system),
  }),
} as const)(async (req, res) => {
  const { connected_account_id } = req.commonParams

  const acs_systems = req.db.acs_systems.filter(
    (acs_system) =>
      acs_system.workspace_id === req.auth.workspace_id &&
      (connected_account_id == null ||
        acs_system.connected_account_ids.includes(connected_account_id)),
  )

  res.status(200).json({
    acs_systems,
  })
})
