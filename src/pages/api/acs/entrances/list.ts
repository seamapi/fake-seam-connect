import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { acs_entrance } from "lib/zod/index.ts"

import { cloneWithoutUnderscoreKeys } from "lib/util/clone-without-underscore-keys.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: "cst_ak_pk",
  commonParams: z.object({
    acs_system_id: z.string().optional(),
    acs_credential_id: z.string().optional(),
  }),
  jsonResponse: z.object({
    acs_entrances: z.array(acs_entrance),
  }),
} as const)(async (req, res) => {
  const { acs_system_id } = req.commonParams

  // TODO: add acs_credential_id filter when credentials are implemented
  const acs_entrances = req.db.acs_entrances.filter(
    (acs_entrance) =>
      acs_entrance.workspace_id === req.auth.workspace_id &&
      (acs_system_id == null || acs_entrance.acs_system_id === acs_system_id),
  )

  res.status(200).json({
    acs_entrances: acs_entrances.map(cloneWithoutUnderscoreKeys),
  })
})
