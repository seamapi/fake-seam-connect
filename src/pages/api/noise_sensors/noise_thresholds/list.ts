import { z } from "zod"

import { noise_threshold } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    device_id: z.string(),
  }),
  jsonResponse: z.object({
    noise_thresholds: z.array(noise_threshold),
  }),
} as const)(async (req, res) => {
  const { device_id } = req.commonParams

  const noise_thresholds = req.db.noise_thresholds.filter(
    (nt) => nt.device_id === device_id,
  )

  res.status(200).json({ noise_thresholds })
})
