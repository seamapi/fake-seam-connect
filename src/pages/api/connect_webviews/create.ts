import { z } from "zod"

import { connect_webview, device_provider } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: ["client_session", "api_key"],
  methods: ["POST"],
  jsonBody: z.object({
    accepted_providers: z.array(device_provider).optional(),
    custom_redirect_url: z.string().optional(),
    device_selection_mode: z.enum(["none", "single", "multiple"]).optional(),
    custom_redirect_failure_url: z.string().optional(),
  }),
  jsonResponse: z.object({
    connect_webview,
  }),
} as const)(async (req, res) => {
  const {
    accepted_providers,
    custom_redirect_url,
    device_selection_mode,
    custom_redirect_failure_url,
  } = req.body

  const connect_webview = req.db.addConnectWebview({
    workspace_id: req.auth.workspace_id,
    accepted_providers,
    custom_redirect_url,
    device_selection_mode,
    custom_redirect_failure_url,
  })
  if (req.auth.type === "client_session") {
    req.db.updateClientSession({
      client_session_id: req.auth.client_session_id,
      connect_webview_ids: req.auth.connect_webview_ids.concat(
        connect_webview.connect_webview_id,
      ),
    })
  }
  res.status(200).json({ connect_webview })
})
