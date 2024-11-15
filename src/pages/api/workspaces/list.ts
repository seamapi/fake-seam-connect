import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { type Workspace, workspace } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: [
    "pat_with_workspace",
    "pat_without_workspace",
    "api_key",
    "client_session",
  ],
  jsonResponse: z.object({
    workspaces: z.array(workspace),
  }),
} as const)(async (req, res) => {
  let workspaces: Workspace[]

  if ("user_id" in req.auth) {
    const auth = req.auth as Extract<typeof req.auth, { user_id: string }>

    workspaces = req.db.workspaces.filter((w) =>
      req.db.user_workspaces.some(
        (uw) =>
          uw.workspace_id === w.workspace_id && uw.user_id === auth.user_id,
      ),
    )
  } else {
    const auth = req.auth as Extract<typeof req.auth, { workspace_id: string }>

    workspaces = req.db.workspaces.filter(
      (w) => w.workspace_id === auth.workspace_id,
    )
  }

  res.status(200).json({
    workspaces,
  })
})
