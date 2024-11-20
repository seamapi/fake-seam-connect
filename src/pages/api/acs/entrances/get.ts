import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { acs_entrance } from "lib/zod/index.ts"

import { cloneWithoutUnderscoreKeys } from "lib/util/clone-without-underscore-keys.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  commonParams: z.object({
    acs_entrance_id: z.string(),
  }),
  jsonResponse: z.object({
    acs_entrance,
  }),
} as const)(async (req, res) => {
  const { acs_entrance_id } = req.commonParams

  const acs_entrance = req.db.acs_entrances.find(
    (acs_entrance) =>
      acs_entrance.acs_entrance_id === acs_entrance_id &&
      acs_entrance.workspace_id === req.auth.workspace_id,
  )

  if (acs_entrance == null) {
    throw new NotFoundException({
      type: "acs_entrance_not_found",
      message: "Access control entrance not found",
    })
  }

  res.status(200).json({
    acs_entrance: cloneWithoutUnderscoreKeys(acs_entrance),
  })
})
