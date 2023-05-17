import { z } from "zod"

export const client_session = z.object({
  client_session_id: z.string(),
  workspace_id: z.string(),
  token: z.string(),
  user_identifier_key: z.string(),
  connect_webview_ids: z.array(z.string()),
  connected_account_ids: z.array(z.string()),
  created_at: z.string().datetime(),
})

export type ClientSession = z.infer<typeof client_session>
