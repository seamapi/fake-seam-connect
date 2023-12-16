import { NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST", "PATCH"],
  commonParams: z.object({
    access_code_id: z.string(),
    is_managed: z.boolean().refine((value) => {
      if (!value) {
        return false
      }
      return true
    }, "Use /access_codes/update to convert access codes to unmanaged"),
    allow_external_modification: z.boolean().optional(),
    force: z.boolean().optional(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const { access_code_id, is_managed, allow_external_modification } =
    req.commonParams

  const access_code = req.db.access_codes.filter(
    (ac) => ac.access_code_id === access_code_id && !ac.is_managed,
  )

  if (access_code == null) {
    throw new NotFoundException({
      type: "access_code_not_found",
      message: "Access code not found",
      data: {
        access_code_id,
      },
    })
  }

  req.db.updateAccessCode({
    access_code_id,
    is_managed,
    is_external_modification_allowed: allow_external_modification ?? false,
  })

  res.status(200).json({})
})
