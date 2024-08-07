import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { simpleHash } from "lib/util/simple-hash.ts"

export default withRouteSpec({
  auth: ["none"],
  methods: ["POST"],
  jsonBody: z.object({
    connect_webview_id: z.string(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const connect_webview = req.db.connect_webviews.find(
    (cw) => cw.connect_webview_id === req.body.connect_webview_id,
  )

  if (connect_webview == null) {
    throw new NotFoundException({
      type: "connect_webview_not_found",
      message: "Connect webview not found",
    })
  }

  const connected_account = req.db.addConnectedAccount({
    provider: "august",
    workspace_id: connect_webview.workspace_id,
    user_identifier: {
      email: `${simpleHash(connect_webview.connect_webview_id)}@example.com`,
    },
  })

  const relevant_cs = req.db.client_sessions.find((cs) =>
    cs.workspace_id.includes(connect_webview.workspace_id),
  )

  if (relevant_cs != null) {
    req.db.updateClientSession({
      client_session_id: relevant_cs.client_session_id,
      connected_account_ids: relevant_cs.connected_account_ids.concat([
        connected_account.connected_account_id,
      ]),
    })
  }

  req.db.addDevice({
    device_type: "august_lock",
    connected_account_id: connected_account.connected_account_id,
    name: "Front Door",
    workspace_id: connect_webview.workspace_id,
  })

  req.db.updateConnectWebview({
    connect_webview_id: connect_webview.connect_webview_id,
    status: "authorized",
    connected_account_id: connected_account.connected_account_id,
  })

  res.status(200).json({})
})
