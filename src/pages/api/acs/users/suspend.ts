import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

export default withRouteSpec({
  methods: ["POST"],
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  jsonBody: z.object({
    acs_user_id: z.string(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { acs_user_id } = req.body

  const acs_user = req.db.acs_users.find(
    (acs_user) =>
      acs_user.acs_user_id === acs_user_id &&
      acs_user.workspace_id === req.auth.workspace_id,
  )

  if (acs_user == null) {
    throw new NotFoundException({
      type: "acs_user_not_found",
      message: `Access control user not found`,
    })
  }

  req.db.updateAcsUser({ acs_user_id, is_suspended: true })

  res.status(200).json({})
})
