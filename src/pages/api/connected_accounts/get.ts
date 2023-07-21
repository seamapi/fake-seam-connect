import { NotFoundException } from "nextlove"
import { z } from "zod"

import { connected_account } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    connected_account_id: z.string(),
  }),
  jsonResponse: z.object({
    connected_account,
  }),
} as const)(async (req, res) => {
  const connected_account = req.db.connected_accounts.find(
    (cw) => cw.connected_account_id === req.commonParams.connected_account_id
  )
  if (connected_account == null) {
    throw new NotFoundException({
      type: "connected_account_not_found",
      message: "Connected account not found",
    })
  }
  res.status(200).json({ connected_account })
})
