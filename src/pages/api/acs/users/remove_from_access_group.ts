import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

export default withRouteSpec({
  methods: ["DELETE", "POST"],
  auth: "cst_ak_pk",
  jsonBody: z.object({
    acs_user_id: z.string(),
    acs_access_group_id: z.string(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { acs_user_id, acs_access_group_id } = req.body

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

  const acs_access_group = req.db.acs_access_groups.find(
    (acs_access_group) =>
      acs_access_group.acs_access_group_id === acs_access_group_id &&
      acs_access_group.workspace_id === req.auth.workspace_id,
  )
  if (acs_access_group == null) {
    throw new NotFoundException({
      type: "acs_access_group_not_found",
      message: "Access control group not found",
    })
  }

  req.db.removeAcsUserFromAcsAccessGroup({
    acs_access_group_id,
    acs_user_id,
  })

  res.status(200).json({})
})
