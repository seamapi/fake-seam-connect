import { z } from "zod"

const userWorkspace = z.object({
  user_workspace_id: z.string(),
  user_id: z.string(),
  workspace_id: z.string(),
  created_at: z.string().datetime(),
  is_owner: z.boolean(),
})

export type UserWorkspace = z.infer<typeof userWorkspace>
