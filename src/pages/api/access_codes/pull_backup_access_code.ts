import { z } from "zod"

import { access_code } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { BadRequestException, NotFoundException } from "nextlove"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z.object({
    access_code_id: z.string(),
  }),
  jsonResponse: z.object({
    backup_access_code: access_code,
  }),
} as const)(async (req, res) => {
  const { access_code_id } = req.body

  const access_code = req.db.access_codes.find(
    (ac) => ac.access_code_id === access_code_id
  )
  if (!access_code) {
    throw new NotFoundException({
      type: "access_code_not_found",
      message: "Could not find an access_code with device_id or access_code_id",
      data: { access_code_id },
    })
  }

  let { pulled_backup_access_code_id } = access_code
  let backup_access_code

  if (!pulled_backup_access_code_id) {
    backup_access_code = req.db.access_codes.find(
      (ac) => ac.is_backup && ac.device_id === access_code.device_id
    )

    if (!backup_access_code) {
      throw new BadRequestException({
        type: "empty_backup_access_code_pool",
        message: "Backup access code pool is empty.",
      })
    }

    pulled_backup_access_code_id = backup_access_code.access_code_id
  }

  backup_access_code = req.db.access_codes.find(
    (ac) => ac.access_code_id === pulled_backup_access_code_id
  )!

  res.status(200).json({ backup_access_code })
})
