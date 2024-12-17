import { BadRequestException } from "nextlove"
import { z } from "zod"

import { SEAM_EVENT_LIST } from "lib/constants.ts"
import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { cloneWithoutUnderscoreKeys } from "lib/util/clone-without-underscore-keys.ts"
import { webhook } from "lib/zod/webhook.ts"

export default withRouteSpec({
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  methods: ["POST"],
  jsonBody: z.object({
    url: z.string().url(),
    event_types: z.array(z.string()).default(["*"]),
  }),
  jsonResponse: z.object({
    webhook,
  }),
} as const)(async (req, res) => {
  const { url, event_types } = req.body
  const { workspace_id } = req.auth

  const invalid_event_types = event_types.filter(
    (event_type) => !SEAM_EVENT_LIST.includes(event_type),
  )
  const should_include_all_events =
    event_types.length === 1 && event_types[0] === "*"

  if (!should_include_all_events && invalid_event_types.length > 0) {
    throw new BadRequestException({
      type: "invalid_event_types",
      message: "Invalid event types",
    })
  }

  const webhook = req.db.addWebhook({ url, workspace_id, event_types })

  res.status(200).json({
    webhook: cloneWithoutUnderscoreKeys(webhook),
  })
})
