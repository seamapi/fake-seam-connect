import { z } from "zod"

import { connect_webview } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    connect_webviews: z.array(connect_webview),
  }),
} as const)(async (req, res) => {
  const connect_webviews = req.db.connect_webviews.filter(
    (cw) => cw.workspace_id === req.auth.workspace_id,
  )

  res.status(200).json({ connect_webviews })
})
