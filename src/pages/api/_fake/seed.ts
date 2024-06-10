import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { seed } from "lib/database/seed.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["GET"],
  jsonBody: z.any().optional(),
  jsonResponse: z.object({}),
} as const)(async (_, res) => {
  res.status(200).json(seed)
})
