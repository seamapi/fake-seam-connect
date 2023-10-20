import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { Workspace, workspace } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["GET", "POST"],
  auth: "cst_ak_pk",
  jsonResponse: z.object({
    workspace,
  }),
} as const)(async (req, res) => {
  const workspace = req.db.workspaces.find(
    (w) => w.workspace_id === req.auth.workspace_id
  )

  res.status(200).json({
    workspace: workspace as Workspace,
  })
})
