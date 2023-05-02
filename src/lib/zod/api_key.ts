import { z } from "zod"

export const api_key = z.object({
  api_key_id: z.string().uuid(),
  api_key_num: z.number(),
  name: z.string(),
  short_token: z.string(),
  created_at: z.string().datetime(),
  user_id: z.string().uuid(),
})
