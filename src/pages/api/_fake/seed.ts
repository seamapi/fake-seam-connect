import { z } from "zod"

import { seed } from "lib/database/seed.ts"
import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["GET"],
  jsonResponse: z.literal(seed),
} as const)(async (_, res) => {
  res.status(200).json(seed)
})
