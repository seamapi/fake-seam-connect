import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk", // TODO: admin
  methods: ["POST", "PUT"],
  jsonBody: z.object({
    email: z.string(),
    access_token_name: z.string(),
  }),
  jsonResponse: z.object({
    user_with_pat: z.object({
      user_id: z.string(),
      pat: z.string(),
    }),
  }),
} as const)(async (_req, res) => {
  res.status(500).end("Not implemented!")
})
