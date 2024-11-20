import { NotFoundException } from "nextlove"
import { z } from "zod"

import { connect_webview } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["GET", "POST"],
  commonParams: z.object({
    connect_webview_id: z.string(),
  }),
  jsonResponse: z.object({
    connect_webview,
  }),
} as const)(async (req, res) => {
  const connect_webview = req.db.connect_webviews.find(
    (cw) => cw.connect_webview_id === req.commonParams.connect_webview_id,
  )
  if (connect_webview == null) {
    throw new NotFoundException({
      type: "connect_webview_not_found",
      message: "Connect webview not found",
    })
  }
  res.status(200).json({ connect_webview })
})
