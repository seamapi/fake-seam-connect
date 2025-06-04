import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { hex_color_code, workspace } from "lib/zod/workspace.ts"

export const jsonBody = z.object({
  workspace_name: z.string(),
  connect_partner_name: z.string(),
  is_sandbox: z.boolean(),
  webview_primary_button_color: hex_color_code.optional(),
  webview_logo_shape: z.enum(["circle", "square"]).optional(),
})

export const route_spec = {
  methods: ["POST"],
  auth: "pat_without_workspace",
  jsonBody: jsonBody
    .omit({ workspace_name: true })
    .extend({ name: z.string() }),
  jsonResponse: z.object({
    workspace,
  }),
} as const

export default withRouteSpec(route_spec)(async (req, res) => {
  const { name, connect_partner_name, is_sandbox } = req.body

  const workspace = req.db.addWorkspace({
    name,
    connect_partner_name,
    is_sandbox,
  })

  res.status(200).json({
    workspace,
  })
})
