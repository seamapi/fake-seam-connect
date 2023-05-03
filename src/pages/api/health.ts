import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

const jsonResponse = z.object({
  note: z.string(),
  ok: z.boolean(),
})

export default withRouteSpec({
  auth: "none",
  methods: ["GET"],
  middlewares: [],
  jsonResponse,
} as const)(async (_req, res) => {
  res.status(200).json({
    note: "This is not part of the real API.",
    ok: true,
  })
})
