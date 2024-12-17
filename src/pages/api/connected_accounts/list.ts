import { z } from "zod"

import { connected_account } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    connected_accounts: z.array(connected_account),
  }),
} as const)(async (req, res) => {
  res.status(200).json({
    connected_accounts: req.db.connected_accounts
      .filter((ca) =>
        req.auth.type === "client_session"
          ? req.auth.connected_account_ids.includes(ca.connected_account_id)
          : true,
      )
      .filter((ca) => ca.workspace_id === req.auth.workspace_id),
  })
})
