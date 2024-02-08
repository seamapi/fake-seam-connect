import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { public_service_health } from "lib/zod/index.ts"

export const route_spec = {
  auth: "none",
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    ok: z.boolean(),
    msg: z.literal("I’m one with the Force. The Force is with me."),
    last_service_evaluation_at: z.string().optional(),
    service_health_statuses: z.array(public_service_health),
  }),
} as const

export default withRouteSpec(route_spec)(async (_req, res) => {
  res.status(200).json({
    ok: true,
    msg: "I’m one with the Force. The Force is with me.",
    last_service_evaluation_at: new Date().toISOString(),
    service_health_statuses: [
      {
        service: "august.sandbox.login",
        status: "healthy",
        description: "August Login Working on Sandbox Workspaces",
      },
    ],
  })
})
