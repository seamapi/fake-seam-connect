import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { z } from "zod"

export const route_spec = {
  methods: ["POST", "PUT"],
  auth: "cst_ak_pk",
  commonParams: z.object({
    user_identity_id: z.string().uuid(),
    acs_user_id: z.string().uuid(),
  }),
  jsonResponse: z.object({}),
} as const

export default withRouteSpec(route_spec)(async (req, res) => {
  res.status(500).end("Not implemented!")
})
