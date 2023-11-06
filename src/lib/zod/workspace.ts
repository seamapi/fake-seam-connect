import { z } from "zod"

export const workspace = z.object({
  workspace_id: z.string(),
  name: z.string(),
  publishable_key: z.string(),
  created_at: z.string(),
  is_sandbox: z.boolean(),
})

export type Workspace = z.infer<typeof workspace>
