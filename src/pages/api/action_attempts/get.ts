import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { action_attempt } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: "cst_ak_pk",
  commonParams: z.object({
    action_attempt_id: z.string(),
  }),
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { action_attempt_id } = req.commonParams

  const action_attempt = req.db.findActionAttempt({ action_attempt_id })

  if (action_attempt == null) {
    throw new NotFoundException({
      type: "action_attempt_not_found",
      message: "action_attempt not found",
      data: {
        action_attempt_id,
      },
    })
  }

  res.status(200).json({
    action_attempt,
  })
})
