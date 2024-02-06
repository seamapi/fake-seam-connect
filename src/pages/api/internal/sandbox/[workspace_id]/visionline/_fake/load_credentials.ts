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
  const { db } = req
  const { endpoint_id } = req.commonParams

  const endpoint = db.endpoints.find(
    (endpoint) =>
      endpoint.endpoint_id === endpoint_id &&
      endpoint.endpoint_type === "assa_abloy_credential_service",
  )

  if (endpoint == null) {
    res.status(404).json({
      code: 10002,
      message: `cannot find endpoint with id ${endpoint_id}`,
    })
    return
  }

  const card = db.addAssaAbloyCard({ endpoint_id })

  res.status(200).json({
    cards: [card],
  })
})
