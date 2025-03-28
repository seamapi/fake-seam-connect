import { z } from "zod"

export const bridge = z.object({
  bridge_id: z.string().uuid(),
  created_at: z.string().datetime(),
  workspace_id: z.string().uuid(),
  bridge_client_session_id: z.string().uuid(),
})

export type Bridge = z.infer<typeof bridge>
