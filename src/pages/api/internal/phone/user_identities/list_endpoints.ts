import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { endpoint_schema } from "lib/zod/endpoints.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
  }),
  jsonResponse: z.object({
    endpoints: z.array(endpoint_schema),
  }),
} as const)(async (req, res) => {
  const { custom_sdk_installation_id } = req.body
  const { client_session_id } = req.auth

  const endpoints = req.db.getEndpoints({
    client_session_id,
    phone_sdk_installation_id: custom_sdk_installation_id,
  })

  res.status(200).json({
    endpoints,
  })
})
