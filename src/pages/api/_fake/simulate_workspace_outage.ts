import type { Routes } from "@seamapi/fake-seam-connect"
import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  jsonBody: z.object({
    workspace_id: z.string(),
    routes: z.array(z.string()),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { workspace_id, routes } = req.body

  const workspace = req.db.workspaces.find(
    (w) => w.workspace_id === workspace_id,
  )

  if (!workspace) {
    throw new NotFoundException({
      type: "workspace_not_found",
      message: "Workspace not found",
    })
  }

  req.db.simulateWorkspaceOutage(workspace_id, {
    routes: routes as Array<keyof Routes>,
  })

  res.status(200).json({})
})
