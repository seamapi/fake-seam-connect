import { z } from "zod"

export const webhook = z.object({
  webhook_id: z.string(),
  url: z.string(),
  event_types: z.array(z.string()).optional(),
  secret: z.string().optional(),

  created_at: z.string(),
})

export type Webhook = z.infer<typeof webhook> & { _workspace_id: string }
