import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { ActionAttempt } from "lib/zod/action_attempt.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["PATCH", "POST"],
  jsonBody: z.object({
    action_attempt_id: z.string(),
    status: z.enum(["success", "error", "pending"]).optional(),
    action_type: z.string().optional(),
    result: z.any().optional(),
    error: z
      .union([
        z.object({
          type: z.string(),
          message: z.string(),
        }),
        z.null(),
      ])
      .optional(),
  }),
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
    ...(action_attempt_update_payload as Partial<ActionAttempt>),
  })

  res.status(200).json({})
})
