import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["GET", "PUT", "POST"],
  jsonBody: z.any().optional(),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  if (req.method === "GET") {
    res.status(200).json(req.db.getState())
  } else {
    req.db.setState(req.body , true)

    res.status(200).json(req.db.getState())
  }
})
