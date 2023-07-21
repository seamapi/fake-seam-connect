import { z } from "zod"

export const connected_account = z.object({
  connected_account_id: z.string(),
  workspace_id: z.string(),
  connect_webview_id: z.string(),
  user_identifier: z.object({
    email: z.string().optional(),
  }),
  provider: z.string(),
  created_at: z.string(),
})

export type ConnectedAccount = z.infer<typeof connected_account>
