import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export const route_spec = {
  methods: ["POST", "PUT"],
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  commonParams: z.object({
    user_identity_id: z.string().uuid(),
    acs_user_id: z.string().uuid(),
  }),
  jsonResponse: z.object({}),
} as const

export default withRouteSpec(route_spec)(async (_req, res) => {
  res.status(500).end("Not implemented!")
})
