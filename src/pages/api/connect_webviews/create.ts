import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { connect_webview } from "lib/zod/index.ts"
import { z } from "zod"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z.object({
    accepted_providers: z.array(z.string()).optional(),
  }),
  jsonResponse: z.object({
    connect_webview,
  }),
} as const)(async (req, res) => {
  const connect_webview = req.db.addConnectWebview({
    workspace_id: req.auth.workspace_id,
  })
  res.status(200).json({ connect_webview })
})
