import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { client_session } from "lib/zod/client_session.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  jsonBody: client_session
    .partial()
    .required({ workspace_id: true, user_identifier_key: true }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { workspace_id, ...client_session_create_payload } = req.body

  const workspace = req.db.workspaces.find(
    (w) => w.workspace_id === workspace_id,
  )

  if (workspace == null) {
    throw new NotFoundException({
      type: "workspace_not_found",
      message: "Workspace not found",
    })
  }

  req.db.addClientSession({ workspace_id, ...client_session_create_payload })

  res.status(200).json({})
})
