import { z } from "zod"

export const hex_color_code = z.string().refine((value) => {
  if (value != null) {
    return /^#[\da-fa-z]{3,6}$/i.test(value)
  }

  return true
}, "Must be a hex color")

export const workspace = z.object({
  workspace_id: z.string(),
  name: z.string(),
  publishable_key: z.string(),
  created_at: z.string(),
  is_sandbox: z.boolean(),
  publishable_key: z.string().optional(),
  is_publishable_key_auth_enabled: z.boolean(),
  is_suspended: z.boolean(),
  company_name: z.string(),
  connect_partner_name: z
    .string()
    .nullable()
    .describe("deprecated: use company_name"),
  connect_webview_customization: z.object({
    primary_button_color: hex_color_code.optional(),
    primary_button_text_color: hex_color_code.optional(),
    success_message: z.string().optional(),
    logo_shape: z.enum(["circle", "square"]).optional(),
    inviter_logo_url: z.string().optional(),
  }),
})

export type Workspace = z.infer<typeof workspace>
