import { z } from 'zod'

export const connect_webview = z.object({
  connect_webview_id: z.string(),
  workspace_id: z.string(),
  status: z.enum(['pending', 'authorized', 'failed']),
  accepted_providers: z.array(z.string()).optional(),
  connected_account_id: z.string().optional(),
  created_at: z.string(),
})

export type ConnectWebview = z.infer<typeof connect_webview>
