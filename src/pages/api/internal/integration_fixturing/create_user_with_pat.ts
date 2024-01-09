import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { z } from "zod"

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
} as const)(async (req, res) => {
  res.status(500).end("Not implemented!")
})
