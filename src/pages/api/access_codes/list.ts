import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { access_code } from "lib/zod/index.ts"
import { z } from "zod"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    device_id: z.string(),
  }),
  jsonResponse: z.object({
    access_codes: z.array(access_code),
  }),
} as const)(async (req, res) => {
  res.status(200).json({
    access_codes: req.db.access_codes.filter(
      (ac) => ac.device_id === req.commonParams.device_id
    ),
  })
})
