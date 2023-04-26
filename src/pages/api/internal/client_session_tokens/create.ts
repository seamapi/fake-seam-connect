import { z } from 'zod'

import { withRouteSpec } from 'lib/middleware/index.ts'

const jsonResponse = z.object({
  note: z.string(),
  ok: z.boolean(),
})

export default withRouteSpec({
  auth: 'none',
  methods: ['GET'],
  middlewares: [],
  jsonResponse,
} as const)(async (req, res) => {
  // req.db.
})
