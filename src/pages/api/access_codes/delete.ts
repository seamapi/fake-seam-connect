import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { action_attempt } from "lib/zod/action_attempt.ts"

const json_body = z.object({
  access_code_id: z.string(),
  device_id: z.string().optional(),
  sync: z.boolean().default(false),
})

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST", "DELETE"],
  jsonBody: json_body,
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { access_code_id, device_id } = req.body

  const access_code = req.db.findAccessCode({ access_code_id, device_id })

  if (access_code == null) {
    throw new NotFoundException({
      type: "access_code_not_found",
      message: `Could not find an access_code with device_id or access_code_id`,
      data: { device_id, access_code_id },
    })
  }

  req.db.deleteAccessCode(access_code_id)

  res.status(200).json({
    action_attempt: {
      status: "success",
      action_type: "delete",
      action_attempt_id: "attempt_1",
      result: null,
      error: null,
    },
  })
})
