import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const action_attempt_update_schema = z.union([
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
  z.object({
    status: z.literal("pending"),
    action_attempt_id: z.string(),
  }),
])

type ActionAttemptUpdateSchema = z.infer<typeof action_attempt_update_schema>

export default withRouteSpec({
  auth: "none",
  methods: ["PATCH", "POST"],
  jsonBody: action_attempt_update_schema,
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { action_attempt_id } = req.body

  const action_attempt = req.db.action_attempts.find(
    (a) => a.action_attempt_id === action_attempt_id,
  )

  if (action_attempt == null) {
    throw new NotFoundException({
      type: "action_attempt_not_found",
      message: "Action attempt not found",
    })
  }

  const update_payload = createUpdatePayload(req.body)

  req.db.updateActionAttempt({
    action_attempt_id,
    ...update_payload,
  })

  res.status(200).json({})
})

function createUpdatePayload(body: ActionAttemptUpdateSchema) {
  const { status } = body

  switch (status) {
    case "success":
      return { status, result: body.result, error: null }
    case "error":
      return { status, error: body.error, result: null }
    case "pending":
      return { status, result: null, error: null }
  }
}
