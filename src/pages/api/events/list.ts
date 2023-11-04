import { z } from "zod"

import { between_timestamps, event, timestamp } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z
    .object({
      since: timestamp.optional(),
      between: between_timestamps.optional(),
      device_id: z.string().optional(),
      device_ids: z.array(z.string()).optional(),
      access_code_id: z.string().optional(),
      access_code_ids: z.array(z.string()).optional(),
      event_type: z.string().optional(),
      event_types: z.array(z.string()).optional(),
      connected_account_id: z.string().optional(),
    })
    .refine(
      (payload) => payload.since ?? payload.between,
      "Must specify either since or between"
    )
    .refine(
      (payload) => !(payload.since != null && payload.between != null),
      "Cannot specify both since and between"
    ),
  jsonResponse: z.object({
    events: z.array(event),
  }),
} as const)(async (req, res) => {
  const {
    since,
    between,
    event_type,
    event_types,
    connected_account_id,
    device_id,
    device_ids,
    access_code_id,
    access_code_ids,
  } = req.commonParams

  const events = req.db.events
    .filter((e) => {
      if (since == null) return true
      const event_created_at_date = new Date(e.created_at)
      return event_created_at_date > new Date(since)
    })
    .filter((e) => {
      if (between == null) return true
      const [start, end] = between
      if (start == null || end == null) return true
      const event_created_at_date = new Date(e.created_at)
      return (
        event_created_at_date > new Date(start) &&
        event_created_at_date < new Date(end)
      )
    })
    .filter((e) => {
      if (event_type == null) return true
      return e.event_type === event_type
    })
    .filter((e) => {
      if (event_types == null) return true
      return event_types.includes(e.event_type)
    })
    .filter((e) => {
      if (connected_account_id == null) return true
      if (!("connected_account_id" in e)) return true
      return e.connected_account_id === connected_account_id
    })
    .filter((e) => {
      if (device_id == null) return true
      if (!("device_id" in e)) return true
      return e.device_id === device_id
    })
    .filter((e) => {
      if (device_ids == null) return true
      if (!("device_id" in e)) return true
      if (e.device_id == null) return true
      return device_ids.includes(e.device_id)
    })
    .filter((e) => {
      if (access_code_id == null) return true
      if (!("access_code_id" in e)) return true
      return e.access_code_id === device_id
    })
    .filter((e) => {
      if (access_code_ids == null) return true
      if (!("access_code_id" in e)) return true
      if (e.access_code_id == null) return true
      return access_code_ids.includes(e.access_code_id)
    })

  res.status(200).json({ events })
})
