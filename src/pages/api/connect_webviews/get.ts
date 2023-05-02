import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { connect_webview } from "lib/zod/index.ts"
import { NotFoundException } from "nextlove"
import { z } from "zod"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET"],
  queryParams: z.object({
    connect_webview_id: z.string(),
  }),
  jsonResponse: z.object({
    connect_webview,
  }),
} as const)(async (req, res) => {
  const connect_webview = req.db.connect_webviews.find(
    (cw) => cw.connect_webview_id === req.query.connect_webview_id
  )
  if (!connect_webview) {
    throw new NotFoundException({
      type: "connect_webview_not_found",
      message: "Connect webview not found",
    })
  }
  res.status(200).json({ connect_webview })
})
