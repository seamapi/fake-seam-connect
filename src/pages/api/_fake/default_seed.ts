import { z } from "zod"

import { seed } from "lib/database/seed.ts"
import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const seed_schema = z.object(
  Object.fromEntries(
    Object.entries(seed).map(([key, value]) => [key, z.literal(value)]),
  ),
)

export default withRouteSpec({
  auth: "none",
  methods: ["GET"],
  jsonResponse: seed_schema,
} as const)(async (_, res) => {
  res.status(200).json(seed)
})
