import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { cloneWithoutUnderscoreKeys } from "lib/util/clone-without-underscore-keys.ts"
import { webhook } from "lib/zod/webhook.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    webhook_id: z.string(),
  }),
  jsonResponse: z.object({
    webhook,
  }),
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

  res.status(200).json({ webhook: cloneWithoutUnderscoreKeys(webhook) })
})
