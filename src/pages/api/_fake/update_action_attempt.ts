import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["PATCH", "POST"],
  jsonBody: z.union([
    z.object({
      status: z.literal("success"),
      action_attempt_id: z.string(),
      result: z.any(),
    }),
    z.object({
      status: z.literal("error"),
      action_attempt_id: z.string(),
      error: z.object({
        type: z.string(),
        message: z.string(),
      }),
    }),
  ]),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { action_attempt_id, ...action_attempt_update_payload } = req.body

  const action_attempt = req.db.action_attempts.find(
    (a) => a.action_attempt_id === action_attempt_id,
  )

  if (action_attempt == null) {
    throw new NotFoundException({
      type: "action_attempt_not_found",
      message: "Action attempt not found",
    })
  }

  req.db.updateActionAttempt({
    action_attempt_id,
    ...action_attempt_update_payload,
  })

  res.status(200).json({})
})
