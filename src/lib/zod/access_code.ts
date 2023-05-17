import { z } from "zod"

export const access_code = z.object({
  access_code_id: z.string(),
  device_id: z.string(),
  name: z.string(),
  code: z.string(),
  created_at: z.string().datetime(),
})

export type AccessCode = z.infer<typeof access_code>
