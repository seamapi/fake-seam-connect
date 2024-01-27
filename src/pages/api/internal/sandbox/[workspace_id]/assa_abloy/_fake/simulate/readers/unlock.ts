import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  jsonBody: z.object({
    reader_id: z.number(),
    tap: z.boolean().optional(),
    credential: z.object({
      format: z.object({
        name: z.string(),
      }),
      card_number: z.string(),
      facility_code: z.string().optional(),
    }),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const {
    body: { reader_id, credential, tap },
  } = req

  if (tap != null) {
    res.status(501).send("Only tap to unlock is implemented")
    return
  }

  const { format, card_number } = credential

  const card = req.db.assa_abloy_cards.find(
    (card) => card.id === card_number && card.format === format.name,
  )

  if (card == null) {
    res.status(404).json({
      stauts: 404,
      code: 40401,
      resource: null,
      message: "The resource does not exist.",
      developerMessage: "The resource does not exist.",
    })
    return
  }

  // Only door with reader_id of 1 exists. Can be changed in `addAssaAbloyCard`
  const is_allowed =
    card.doorOperations.some((d) => d.doors.includes(reader_id.toString())) &&
    !card.cancelled &&
    !card.notIssued &&
    !card.expired &&
    !card.discarded

  if (!is_allowed) {
    res.status(403).json({
      message: "Access denied",
    })
    return
  }

  req.db.addSimulatedReaderEvent({
    reader_id,
    simulated_event_type: "tap",
    card_number,
  })
  res.status(200).json({})
})
