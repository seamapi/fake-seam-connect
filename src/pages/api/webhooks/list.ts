import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { cloneWithoutUnderscoreKeys } from "lib/util/clone-without-underscore-keys.ts"
import { webhook } from "lib/zod/webhook.ts"

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    webhooks: z.array(webhook),
  }),
} as const)(async (req, res) => {
  const { workspace_id } = req.auth

  const webhooks = req.db.webhooks.filter(
    (w) => w._workspace_id === workspace_id,
  )

  res
    .status(200)
    .json({ webhooks: webhooks.map((w) => cloneWithoutUnderscoreKeys(w)) })
})
