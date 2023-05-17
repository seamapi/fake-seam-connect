import { z } from "zod"

export const access_token = z.object({
  access_token_id: z.string(),
  name: z.string(),
  token: z.string(),
  short_token: z.string(),
  user_id: z.string(),
  created_at: z.string().datetime(),
})
