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
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["POST", "DELETE"],
  jsonBody: json_body,
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const { access_code_id, device_id, sync } = req.body

  const access_code = req.db.findAccessCode({ access_code_id, device_id })

  if (access_code == null) {
    throw new NotFoundException({
      type: "access_code_not_found",
      message: `Could not find an access_code with device_id or access_code_id`,
      data: { device_id, access_code_id },
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "DELETE_ACCESS_CODE",
  })
  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  req.db.deleteAccessCode(access_code_id)

  req.db.addEvent({
    event_type: "access_code.deleted",
    workspace_id: req.auth.workspace_id,
    device_id,
    access_code_id: access_code.access_code_id,
    connected_account_id: req.db.devices.find(
      (d) => d.device_id === access_code.device_id,
    )?.connected_account_id,
  })

  res.status(200).json({
    action_attempt: sync ? action_attempt_sync : action_attempt,
  })
})
