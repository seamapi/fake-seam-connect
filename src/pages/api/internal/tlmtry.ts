import { withCors, withRouteSpec } from "lib/middleware/index.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  middlewares: [withCors],
} as const)(async (_req, res) => {
  res.status(204).end()
})
