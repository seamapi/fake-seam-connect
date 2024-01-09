import { z } from "zod"
import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { workspace } from "lib/zod/workspace.ts"

export const optional_hex_color_code = z
  .string()
  .optional()
  .refine((value) => {
    if (value) {
      return /^#[\da-fa-z]{3,6}$/i.test(value)
    }

    return true
  }, "Must be a hex color")

const jsonBody = z.object({
  workspace_name: z.string(),
  connect_partner_name: z.string(),
  is_sandbox: z.boolean(),
  webview_primary_button_color: optional_hex_color_code,
  webview_logo_shape: z.enum(["circle", "square"]).optional(),
})

export const route_spec = {
  methods: ["POST"],
  auth: "cst_ak_pk", // TODO: session_or_access_token_optional_workspace_id
  jsonBody,
  jsonResponse: z.object({
    workspace: workspace.extend({
      is_sandbox: z.boolean(),
    }),
  }),
} as const

export default withRouteSpec(route_spec)(async (req, res) => {
  res.status(500).end("Not implemented!")
})
