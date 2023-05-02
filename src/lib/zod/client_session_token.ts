import { z } from 'zod'

export const client_session_token = z.object({
  client_session_token_id: z.string(),
  workspace_id: z.string(),
  token: z.string(),
  short_token: z.string(),
  long_token: z.string(),
  user_identifier_key: z.string(),
  connect_webview_ids: z.array(z.string()),
  connected_account_ids: z.array(z.string()),
  created_at: z.string().datetime(),
})

export type ClientSessionToken = z.infer<typeof client_session_token>
