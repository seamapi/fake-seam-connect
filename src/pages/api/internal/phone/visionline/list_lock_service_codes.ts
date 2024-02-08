import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["GET", "POST"],
  commonParams: z.object({}),
  jsonResponse: z.object({
    list_lock_service_codes_response: z.object({
      lock_service_codes: z.array(z.number().int()),
    }),
  }),
} as const)(async (_, res) => {
  res.status(200).json({
    list_lock_service_codes_response: {
      lock_service_codes: [1],
    },
  })
})
