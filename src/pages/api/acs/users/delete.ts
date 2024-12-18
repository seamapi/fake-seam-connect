import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

export default withRouteSpec({
  methods: ["DELETE", "POST"],
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  commonParams: z.object({
    acs_user_id: z.string(),
  }),
  jsonResponse: z.object({}),
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
      message: "Access control user not found",
    })
  }

  req.db.deleteAcsUser(acs_user_id)

  req.db.acs_access_groups
    .filter((access_group) => access_group._acs_user_ids.includes(acs_user_id))
    .forEach(({ acs_access_group_id }) => {
      req.db.removeAcsUserFromAcsAccessGroup({
        acs_access_group_id,
        acs_user_id,
      })
    })

  res.status(200).json({
    acs_user,
  })
})
