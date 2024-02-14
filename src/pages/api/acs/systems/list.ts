import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { acs_system } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: "cst_ak_pk",
  commonParams: z.object({
    connected_account_id: z.string().optional(),
  }),
  jsonResponse: z.object({
    acs_system,
  }),
} as const)(async (req, res) => {
  const { connected_account_id } = req.commonParams

  const acs_system = req.db.acs_systems.find(
    (acs_system) =>
      acs_system.workspace_id === req.auth.workspace_id &&
      (!connected_account_id ||
        acs_system.connected_account_ids.includes(connected_account_id)),
  )

  if (acs_system == null) {
    throw new NotFoundException({
      type: "acs_system_not_found",
      message: "Access control system not found",
    })
  }

  res.status(200).json({
    acs_system,
  })
})
