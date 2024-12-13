import { NotFoundException } from "nextlove"
import { z } from "zod"

import { connected_account } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: [
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
    "client_session",
  ],
  methods: ["GET", "POST"],
  commonParams: z.union([
    z.object({
      connected_account_id: z.string(),
    }),
    z.object({
      email: z.string().email(),
    }),
  ]),
  jsonResponse: z.object({
    connected_account,
  }),
} as const)(async (req, res) => {
  const req_params = req.commonParams

  const connected_account = req.db.connected_accounts.find((ca) =>
    "connected_account_id" in req_params
      ? ca.connected_account_id === req_params.connected_account_id
      : ca.user_identifier?.email === req_params.email,
  )
  if (connected_account == null) {
    throw new NotFoundException({
      type: "connected_account_not_found",
      message: "Connected account not found",
    })
  }
  res.status(200).json({ connected_account })
})
