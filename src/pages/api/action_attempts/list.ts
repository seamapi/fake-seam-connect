import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { action_attempt } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  commonParams: z.object({
    action_attempt_ids: z.array(z.string()),
  }),
  jsonResponse: z.object({
    action_attempts: z.array(action_attempt),
  }),
} as const)(async (req, res) => {
  const { action_attempt_ids } = req.commonParams

  const action_attempts = req.db.action_attempts.filter((aa) =>
    action_attempt_ids.includes(aa.action_attempt_id),
  )

  if (action_attempts.length === 0) {
    throw new NotFoundException({
      type: "action_attempts_not_found",
      message: "Action attempts not found",
      data: {
        action_attempt_ids,
      },
    })
  }

  res.status(200).json({
    action_attempts,
  })
})
