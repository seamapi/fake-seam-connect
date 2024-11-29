import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { workspace } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: ["client_session", "pat_with_workspace", "api_key", "console_session"],
  jsonResponse: z.object({
    workspace,
  }),
} as const)(async (req, res) => {
  const workspace = req.db.workspaces.find(
    (w) => w.workspace_id === req.auth.workspace_id,
  )

  if (workspace == null) {
    throw new NotFoundException({
      type: "workspace_not_found",
      message: "Workspace not found",
    })
  }

  res.status(200).json({
    workspace,
  })
})
