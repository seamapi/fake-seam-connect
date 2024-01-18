import { z } from "zod"

export const client_session = z.object({
  client_session_id: z.string(),
  device_count: z.number().optional(),
  workspace_id: z.string(),
  token: z.string(),
  user_identifier_key: z.string(),
  user_identity_id: z.string().optional(),
  user_identity_ids: z.array(z.string().uuid()).optional(),
  connect_webview_ids: z.array(z.string()),
  connected_account_ids: z.array(z.string()),
  created_at: z.string().datetime(),
})

export type ClientSession = z.infer<typeof client_session>
