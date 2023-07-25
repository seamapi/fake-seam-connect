import { z } from "zod"

export const api_key = z.object({
  api_key_id: z.string(),
  name: z.string(),
  token: z.string().optional(),
  short_token: z.string(),
  created_at: z.string().datetime(),
  // TODO add when we support users
  // user_id: z.string().uuid(),
})

export type ApiKey = z.infer<typeof api_key>
