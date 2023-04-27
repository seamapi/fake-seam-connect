import { z } from 'zod'

export const client_session_token = z.object({
  client_session_token_id: z.string(),
  name: z.string(),
  token: z.string(),
  short_token: z.string(),
  user_id: z.string(),
  created_at: z.string().datetime(),
})

export type ClientSessionToken = z.infer<typeof client_session_token>
