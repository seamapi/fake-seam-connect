import { BadRequestException, NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

export default withRouteSpec({
  methods: ["POST"],
  auth: "cst_ak_pk",
  jsonBody: z.object({
    acs_entrance_id: z.string(),
    acs_user_id: z.string(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { acs_entrance_id, acs_user_id } = req.body

  const acs_entrance = req.db.acs_entrances.find(
    (acs_entrance) =>
      acs_entrance.acs_entrance_id === acs_entrance_id &&
      acs_entrance.workspace_id === req.auth.workspace_id,
  )
  if (acs_entrance == null) {
    throw new NotFoundException({
      type: "acs_entrance_not_found",
      message: "Entrance not found",
    })
  }

  const acs_user = req.db.acs_users.find(
    (acs_user) => acs_user.acs_user_id === acs_user_id,
  )
  if (acs_user == null) {
    throw new NotFoundException({
      type: "acs_user_not_found",
      message: "User not found",
    })
  }

  const acs_system = req.db.acs_systems.find(
    (acs_system) => acs_system.acs_system_id === acs_user.acs_system_id,
  )
  // Shouldn't happen as acs user is associated with an acs system, making TS happy
  if (acs_system == null) {
    throw new NotFoundException({
      type: "acs_system_not_found",
      message: "Access control system not found",
    })
  }
  if (acs_system.external_type !== "visionline_system") {
    throw new BadRequestException({
      type: "not_supported",
      message: `${acs_system.external_type} does not support adding acs_entrances to acs_users directly`,
    })
  }

  req.db.grantAcsUserAccessToAcsEntrance({
    acs_user_id,
    acs_entrance_id,
  })

  res.status(200).json({})
})
