import { NotFoundException } from "nextlove"
import { z } from "zod"

import { connected_account, custom_metadata } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["POST"],
  jsonBody: z.object({
    connected_account_id: z.string(),
    automatically_manage_new_devices: z.boolean().optional(),
    custom_metadata: custom_metadata.optional(),
  }),
  jsonResponse: z.object({
    connected_account,
  }),
} as const)(async (req, res) => {
  const {
    connected_account_id,
    automatically_manage_new_devices,
    custom_metadata,
  } = req.body

  const connected_account = req.db.connected_accounts.find(
    (cw) => cw.connected_account_id === connected_account_id,
  )
  if (connected_account == null) {
    throw new NotFoundException({
      type: "connected_account_not_found",
      message: "Connected account not found",
      data: {
        connected_account_id,
      },
    })
  }

  const updates = {
    ...(automatically_manage_new_devices != null && {
      automatically_manage_new_devices,
    }),
    ...(custom_metadata != null && { custom_metadata }),
  }
  const updated_connected_account = req.db.updateConnectedAccount({
    connected_account_id,
    ...updates,
  })

  res.status(200).json({ connected_account: updated_connected_account })
})
