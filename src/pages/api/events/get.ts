import { NotFoundException } from "nextlove"
import { z } from "zod"

import { event } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z
    .object({
      event_id: z.string().optional(),
      event_type: z.string().optional(),
      device_id: z.string().optional(),
    })
    .refine(
      (args) =>
        Boolean(args.event_id) ||
        Boolean(args.event_type) ||
        Boolean(args.device_id),
      "An argument for event_id, event_type, or device_id is required"
    ),
  jsonResponse: z.object({
    event,
  }),
} as const)(async (req, res) => {
  const { device_id, event_id, event_type } = req.commonParams

  const event = req.db.events.find(
    (e) =>
      e.workspace_id === req.auth.workspace_id &&
      (e.event_id === event_id ||
        e.event_type === event_type ||
        ("device_id" in e ? e?.device_id === device_id : false))
  )
  if (event == null) {
    throw new NotFoundException({
      type: "event_not_found",
      message: "Event not found",
    })
  }

  res.status(200).json({ event })
})
