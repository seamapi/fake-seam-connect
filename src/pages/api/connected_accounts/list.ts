import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { connected_account } from "lib/zod/index.ts"
import { z } from "zod"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    connected_accounts: z.array(connected_account),
  }),
} as const)(async (req, res) => {
  res.status(200).json({
    connected_accounts: req.db.connected_accounts.filter(
      (ca) => ca.workspace_id === req.auth.workspace_id
    ),
  })
})
