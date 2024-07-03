import { z } from "zod"

const userSession = z.object({
  user_session_id: z.string(),
  user_id: z.string(),
  key: z.string(),
  created_at: z.string().datetime(),
  is_admin_session: z.boolean(),
})

export type UserSession = z.infer<typeof userSession>
