import { NotFoundException } from "nextlove"
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
  const { sync, device_id } = req.body

  const device = req.db.devices.find((d) => d.device_id === device_id)
  if (device == null) {
    throw new NotFoundException({
      type: "device_not_found",
      message: "Device not found",
    })
  }

  const action_attempt = req.db.addActionAttempt({
    action_type: "UNLOCK_DOOR",
  })

  const action_attempt_sync = req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  req.db.updateDevice({ device_id, properties: { locked: false } })

  req.db.addEvent({
    event_type: "lock.unlocked",
    workspace_id: req.auth.workspace_id,
    device_id,
    connected_account_id: device.connected_account_id,
  })

  res.status(200).json({
    action_attempt: sync ? action_attempt_sync : action_attempt,
  })
})
