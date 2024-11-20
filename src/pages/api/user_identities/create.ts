import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export const user_identity = z.object({
  user_identity_id: z.string().uuid(),
  user_identity_key: z.string().nonempty().nullable(),
  email_address: z.string().email().nullable(),
  display_name: z.string().nonempty(),
  full_name: z.string().nonempty().nullable(),
  created_at: z.string().datetime(),
  workspace_id: z.string().uuid(),
})

export default withRouteSpec({
  auth: ["client_session", "pat_with_workspace", "console_session", "api_key"],
  methods: ["POST"],
  commonParams: z.object({
    user_identity_key: user_identity.shape.user_identity_key.optional(),
    email_address: user_identity.shape.email_address.optional(),
    full_name: user_identity.shape.full_name.optional(),
  }),
  jsonResponse: z.object({
    user_identity,
  }),
} as const)(async (_req, res) => {
  res.status(500).end("Not implemented!")
})
