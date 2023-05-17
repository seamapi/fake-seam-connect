import { NotFoundException } from "nextlove"
import { z } from "zod"

import { access_code } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["GET", "POST"],
  commonParams: z.object({
    access_code_id: z.string(),
  }),
  jsonResponse: z.object({
    access_code: access_code,
  }),
} as const)(async (req, res) => {
  const access_code = req.db.access_codes.find(
    (ac) => ac.access_code_id === req.commonParams.access_code_id
  )
  if (!access_code) {
    throw new NotFoundException({
      type: "not_found",
      message: "Access Code Not Found",
    })
  }
  res.status(200).json({ access_code })
})
