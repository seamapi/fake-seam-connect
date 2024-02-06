import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { simulated_event } from "lib/zod/assa_abloy_credential_service.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["GET", "POST"],
  commonParams: z.object({
    reader_id: z.coerce.number(),
  }),
  jsonResponse: z.object({
    events: z.array(simulated_event),
  }),
} as const)(async (req, res) => {
  const {
    commonParams: { reader_id },
  } = req

  const events = req.db.simulatedEvents[reader_id] ?? []

  res.json({
    events,
  })
})
