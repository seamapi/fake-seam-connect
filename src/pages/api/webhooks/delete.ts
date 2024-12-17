import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  methods: ["DELETE", "POST"],
  commonParams: z.object({
    webhook_id: z.string(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { webhook_id } = req.commonParams
  const { workspace_id } = req.auth

  const webhook = req.db.webhooks.find(
    (w) => w.webhook_id === webhook_id && w._workspace_id === workspace_id,
  )
  if (webhook == null) {
    throw new NotFoundException({
      type: "webhook_not_found",
      message: "webhook not found",
    })
  }

  req.db.deleteWebhook(webhook_id)

  res.status(200).json({})
})
