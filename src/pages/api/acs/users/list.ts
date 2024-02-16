import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { acs_user, phone_number } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: "cst_ak_pk",
  commonParams: z.object({
    user_identity_id: z.string().optional(),
    user_identity_phone_number: phone_number.optional(),
    user_identity_email_address: z.string().optional(),
    acs_system_id: z.string().optional(),
  }),
  jsonResponse: z.object({
    acs_users: z.array(acs_user),
  }),
} as const)(async (req, res) => {
  const {
    user_identity_id,
    user_identity_phone_number,
    user_identity_email_address,
    acs_system_id,
  } = req.commonParams

  const user_identity_ids = req.db.user_identities
    .filter(
      (ui) =>
        (user_identity_id != null &&
          ui.user_identity_id === user_identity_id) ||
        (user_identity_phone_number != null &&
          ui.phone_number === user_identity_phone_number) ||
        (user_identity_email_address != null &&
          ui.email_address === user_identity_email_address),
    )
    .map(({ user_identity_id }) => user_identity_id)

  const acs_users = req.db.acs_users.filter(
    (u) =>
      u.workspace_id === req.auth.workspace_id &&
      (acs_system_id == null || u.acs_system_id === acs_system_id) &&
      (user_identity_ids.length === 0 ||
        (u.user_identity_id != null &&
          user_identity_ids.includes(u.user_identity_id))),
  )

  res.status(200).json({
    acs_users,
  })
})
