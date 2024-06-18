import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { workspace } from "lib/zod/workspace.ts"

export const optional_hex_color_code = z
  .string()
  .optional()
  .refine((value) => {
    if (value !== undefined) {
      return /^#[\da-fa-z]{3,6}$/i.test(value)
    }

    return true
  }, "Must be a hex color")

export const jsonBody = z.object({
  workspace_name: z.string(),
  connect_partner_name: z.string(),
  is_sandbox: z.boolean(),
  webview_primary_button_color: optional_hex_color_code,
  webview_logo_shape: z.enum(["circle", "square"]).optional(),
})

export const route_spec = {
  methods: ["POST"],
  auth: ["api_key", "pat_without_workspace"],
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
