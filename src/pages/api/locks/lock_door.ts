import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { action_attempt } from "lib/zod/index.ts"

export const jsonBody = z.object({
  device_id: z.string(),
  sync: z.boolean().default(false),
})

export default withRouteSpec({
  methods: ["POST"],
  auth: "cst_ak_pk",
  jsonBody,
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { sync } = req.body

  const action_attempt = req.db.addActionAttempt({
    action_type: "LOCK_DOOR",
  })

  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  res.status(200).json({
    action_attempt: sync ? action_attempt_sync : action_attempt,
  })
})
