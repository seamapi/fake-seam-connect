import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { workspace } from "lib/zod/workspace.ts"
import { jsonBody } from "pages/api/internal/workspaces/create.ts"

export const route_spec = {
  methods: ["POST"],
  auth: "access_token",
  jsonBody,
  jsonResponse: z.object({
    workspace,
  }),
} as const

export default withRouteSpec(route_spec)(async (req, res) => {
  const { workspace_name, connect_partner_name, is_sandbox } = req.body

  const workspace = req.db.addWorkspace({
    name: workspace_name,
    connect_partner_name,
    is_sandbox,
  })

  res.status(200).json({
    workspace,
  })
})
