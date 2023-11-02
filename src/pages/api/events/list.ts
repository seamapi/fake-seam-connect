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
    device_id,
    access_code_id,
    event_type,
    connected_account_id,
  } = req.commonParams

  const device_ids =
    device_id != null
      ? [device_id, ...(req.commonParams.device_ids ?? [])]
      : req.commonParams.device_ids ?? []
  const access_code_ids =
    access_code_id != null
      ? [access_code_id, ...(req.commonParams.access_code_ids ?? [])]
      : req.commonParams.access_code_ids ?? []
  const event_types =
    event_type != null
      ? [event_type, ...(req.commonParams.event_types ?? [])]
      : req.commonParams.event_types ?? []

  const events = req.db.events.filter((e) => {
    const event_created_at_date = new Date(e.created_at)

    const is_since_valid =
      since == null || event_created_at_date > new Date(since)

    const is_between_valid =
      between == null ||
      (event_created_at_date > new Date(between[0] as string) &&
        event_created_at_date < new Date(between[1] as string))

    const does_device_ids_match =
      "device_id" in e && device_ids.includes(e.device_id as string)

    const does_access_code_ids_match =
      "access_code_id" in e &&
      access_code_ids.includes(e.access_code_id as string)

    const does_event_types_match = event_types.includes(e.event_type)

    const does_connected_account_match =
      connected_account_id == null ||
      ("connected_account_id" in e
        ? e.connected_account_id === connected_account_id
        : true)

    return (
      is_since_valid &&
      is_between_valid &&
      does_device_ids_match &&
      does_access_code_ids_match &&
      does_event_types_match &&
      does_connected_account_match
    )
  })

  res.status(200).json({ events })
})
