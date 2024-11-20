import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { acs_user } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  commonParams: z.object({
    acs_user_id: z.string(),
  }),
  jsonResponse: z.object({
    acs_user,
  }),
} as const)(async (req, res) => {
  const { acs_user_id } = req.commonParams

  const acs_user = req.db.acs_users.find(
    (acs_user) =>
      acs_user.acs_user_id === acs_user_id &&
      acs_user.workspace_id === req.auth.workspace_id,
  )

  if (acs_user == null) {
    throw new NotFoundException({
      type: "acs_user_not_found",
      message: `acs_user not found`,
    })
  }

  res.status(200).json({
    acs_user,
  })
})
