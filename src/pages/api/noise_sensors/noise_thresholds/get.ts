import { NotFoundException } from "nextlove"
import { z } from "zod"

import { noise_threshold } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    noise_threshold_id: z.string(),
  }),
  jsonResponse: z.object({
    noise_threshold,
  }),
} as const)(async (req, res) => {
  const { noise_threshold_id } = req.commonParams

  const noise_threshold = req.db.noise_thresholds.find(
    (nt) => nt.noise_threshold_id === noise_threshold_id
  )

  if (noise_threshold == null) {
    throw new NotFoundException({
      type: "noise_threshold_not_found",
      message: "Noise threshold not found",
    })
  }

  res.status(200).json({ noise_threshold })
})
