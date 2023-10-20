import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { Workspace, workspace } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: "cst_ak_pk",
  jsonResponse: z.object({
    workspaces: z.array(workspace),
  }),
} as const)(async (req, res) => {
  // Multi-workspace API keys aren't supported, so this will always return one
  // workspace
  const workspace = req.db.workspaces.find(
    (w) => w.workspace_id === req.auth.workspace_id
  )

  res.status(200).json({
    workspaces: [workspace] as Workspace[],
  })
})
