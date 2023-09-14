import { withRouteSpec } from "lib/middleware/index.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  middlewares: [],
} as const)(async (_req, res) => {
  res.status(204).end()
})
