import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  credential_service_endpoint,
  credential_service_endpoint_details,
} from "lib/zod/assa_abloy_credential_service.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  jsonBody: z.object({
    invite_code: z.string(),
    endpoint_details: credential_service_endpoint_details.omit({
      seos_tsm_endpoint_id: true,
    }),
  }),
  jsonResponse: z.object({
    endpoint: credential_service_endpoint,
  }),
} as const)(async (req, res) => {
  res.status(500).end("Not implemented!")
})
