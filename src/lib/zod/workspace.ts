import { z } from "zod"

export const workspace = z.object({
  workspace_id: z.string(),
  name: z.string(),
  publishable_key: z.string(),
  created_at: z.string(),
  is_sandbox: z.boolean(),
  is_suspended: z.boolean(),
  company_name: z.string(),
  connect_partner_name: z
    .string()
    .nullable()
    .describe("deprecated: use company_name"),
})

export type Workspace = z.infer<typeof workspace>
