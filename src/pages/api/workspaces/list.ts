import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { type Workspace, workspace } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  // The with_workspace variants are omitted: they are tried first and fail the
  // request when the Seam-Workspace header is missing, which never lets the
  // without_workspace variants run. The without_workspace variants list the
  // same workspaces for this route.
  auth: [
    "api_key",
    "client_session",
    "console_session_without_workspace",
    "pat_without_workspace",
  ],
  jsonResponse: z.object({
    workspaces: z.array(workspace),
  }),
} as const)(async (req, res) => {
  let workspaces: Workspace[]

  if (req.auth.type === "api_key" || req.auth.type === "client_session") {
    const auth = req.auth

    workspaces = req.db.workspaces.filter(
      (w) => w.workspace_id === auth.workspace_id,
    )
  } else {
    const auth = req.auth

    workspaces = req.db.workspaces.filter((w) =>
      req.db.user_workspaces.some(
        (uw) =>
          uw.workspace_id === w.workspace_id && uw.user_id === auth.user_id,
      ),
    )
  }

  res.status(200).json({
    workspaces,
  })
})
