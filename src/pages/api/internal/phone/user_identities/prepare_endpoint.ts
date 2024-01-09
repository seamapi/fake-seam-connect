import { z } from "zod"
import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { endpoint_schema } from "lib/zod/endpoints.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
    // user can provide endpoint_id to force a sync when there is no endpoint_id
    // in our DB
    endpoint_id: z.string(),
  }),
  jsonResponse: z.object({
    endpoint: endpoint_schema.optional(),
  }),
} as const)(async (_req, res) => {
  res.status(500).end("Not implemented!")
})
