import { z } from "zod"

export const client_session = z.object({
  client_session_id: z.string(),
  device_count: z.number().optional(),
  workspace_id: z.string(),
  token: z.string(),
  user_identity_ids: z.array(z.string()),
  connect_webview_ids: z.array(z.string()),
  connected_account_ids: z.array(z.string()),
  created_at: z.string().datetime(),
  expires_at: z.string().datetime(),
  user_identifier_key: z.string().optional(),
  publishable_key: z.string().optional(),
  api_key_id: z.string().optional(),
  revoked_at: z.string().datetime().optional(),
})

export type ClientSession = z.infer<typeof client_session>
