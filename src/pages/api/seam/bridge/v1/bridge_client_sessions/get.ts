import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { bridge_client_session } from "lib/zod/index.ts"

export default withRouteSpec({
  description: `
  ---
  title: Get a Bridge Client Session
  response_key: bridge_client_session
  undocumented: Seam Bridge Client only.
  ---
  Returns the bridge client session associated with the session token used.
  `,
  auth: ["bridge_client_session"],
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    bridge_client_session,
  }),
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

  res.status(200).json({ bridge_client_session })
})
