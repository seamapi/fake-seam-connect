import { z } from "zod"

export const workspace = z.object({
  workspace_id: z.string(),
  name: z.string(),
  publishable_key: z.string(),
  created_at: z.string(),
  is_sandbox: z.boolean(),
  connect_partner_name: z.string().nullable(),
})

export type Workspace = z.infer<typeof workspace>
