import { z } from "zod"

export const access_token = z.object({
  access_token_id: z.string(),
  access_token_name: z.string(),
  email: z.string(),
  short_token: z.string(),
  long_token_hash: z.string(),
  user_id: z.string(),
  created_at: z.string().datetime(),
})

export type AccessToken = z.infer<typeof access_token>
