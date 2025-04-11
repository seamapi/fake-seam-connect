import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

export default withRouteSpec({
  auth: ["bridge_client_session"],
  methods: ["POST"],
  jsonBody: z.object({
    is_tailscale_connected: z.boolean().nullable(),
    tailscale_ip_v4: z.string().nullable(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { db, auth } = req

  const bridge_client_session = db.bridge_client_sessions.find(
    (bridge_client_session) =>
      bridge_client_session.bridge_client_session_id ===
      auth.bridge_client_session.bridge_client_session_id,
  )

  if (bridge_client_session == null) {
    throw new NotFoundException({
      type: "bridge_client_session_not_found",
      message: "Bridge client session not found",
    })
  }

  db.updateBridgeClientSession({
    bridge_client_session_id: bridge_client_session.bridge_client_session_id,
    _last_status_report_received_at: new Date().toISOString(),
  })

  res.status(200).json({})
})
