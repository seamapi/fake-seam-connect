import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { api_key } from "lib/zod/api_key.ts"

const route_spec = {
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
  methods: ["POST"],
  jsonBody: z.object({
    name: z.string(),
  }),
  jsonResponse: z.object({
    api_key: api_key.extend({ token: z.string() }),
  }),
} as const

export default withRouteSpec(route_spec)(async (_req, res) => {
  res.status(500).end("Not implemented!")
})
