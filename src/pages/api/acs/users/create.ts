import { BadRequestException, NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { acs_user } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["POST"],
  auth: "cst_ak_pk",
  jsonBody: z
    .object({
      acs_system_id: z.string(),
      acs_access_group_ids: z.array(z.string()).optional().default([]),
      user_identity_id: z.string().optional(),
      access_schedule: z
        .object({
          starts_at: z.string().datetime(),
          ends_at: z.string().datetime(),
        })
        .optional(),
    })
    .merge(
      acs_user.pick({
        full_name: true,
        email: true,
        phone_number: true,
        email_address: true,
      }),
    ),
  jsonResponse: z.object({
    acs_user,
  }),
} as const)(async (req, res) => {
  const {
    full_name,
    email_address,
    email,
    phone_number,
    acs_system_id: requested_system_id,
    acs_access_group_ids,
    access_schedule,
    user_identity_id,
  } = req.body

  if (full_name == null)
    throw new BadRequestException({
      type: "full_name_required",
      message: "Full name field is required to create a user",
    })

  // TODO: check user_identity when it's implemented

  const acs_system = req.db.acs_systems.find(
    (acs_system) =>
      acs_system.acs_system_id === requested_system_id &&
      acs_system.workspace_id === req.auth.workspace_id,
  )
  if (acs_system == null) {
    throw new NotFoundException({
      type: "acs_system_not_found",
      message: "Access control system not found",
    })
  }

  const acs_user = req.db.addAcsUser({
    acs_system_id: requested_system_id,
    full_name,
    email: email_address ?? email,
    phone_number,
    access_schedule,
    user_identity_id,
    workspace_id: req.auth.workspace_id,
  })

  for (const acs_access_group_id of acs_access_group_ids) {
    const acs_access_group = req.db.acs_access_groups.find(
      (acs_access_group) =>
        acs_access_group.acs_access_group_id === acs_access_group_id &&
        acs_access_group.workspace_id === req.auth.workspace_id,
    )
    if (acs_access_group == null) continue

    req.db.addAcsUserToAcsAccessGroup({
      acs_user_id: acs_user.acs_user_id,
      acs_access_group_id,
    })
  }

  res.status(200).json({
    acs_user,
  })
})
