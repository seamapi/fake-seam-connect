import { z } from "zod"

import { connect_webview, device_providers } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z.object({
    accepted_providers: z.array(device_providers).optional(),
    custom_redirect_url: z.string().optional(),
  }),
  jsonResponse: z.object({
    connect_webview,
  }),
} as const)(async (req, res) => {
  const { accepted_providers, custom_redirect_url } = req.body

  const connect_webview = req.db.addConnectWebview({
    workspace_id: req.auth.workspace_id,
    accepted_providers,
    custom_redirect_url,
  })
  if (req.auth.auth_mode === "client_session_token") {
    req.db.updateClientSession({
      client_session_id: req.auth.client_session_id,
      connect_webview_ids: req.auth.connect_webview_ids.concat(
        connect_webview.connect_webview_id
      ),
    })
  }
  res.status(200).json({ connect_webview })
})
