import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { card } from "lib/zod/assa_abloy_credential_service.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["GET", "POST"],
  commonParams: z.object({
    endpoint_id: z.string(),
  }),
  jsonResponse: z.object({
    cards: z.array(card),
  }),
} as const)(async (req, res) => {
  res.status(500).end("Not implemented!")
})
