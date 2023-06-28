import { BadRequestException, NotFoundException } from "nextlove"
import { z } from "zod"

import { access_code } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

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
      message: "Could not find an access_code with access_code_id",
      data: { access_code_id },
    })
  }
  if (access_code.type !== "time_bound") {
    throw new BadRequestException({
      type: "access_code_not_time_bound",
      message: "Backups can only be used for time_bound access codes.",
    })
  }

  let { pulled_backup_access_code_id } = access_code
  let backup_access_code

  if (!pulled_backup_access_code_id) {
    backup_access_code = req.db.access_codes.find(
      (ac) => ac.is_backup && ac.device_id === access_code.device_id
    )

    if (!backup_access_code) {
      backup_access_code = req.db.addAccessCode({
        code: Math.random().toString().slice(-4),
        device_id: access_code.device_id,
        name: "New Backup Access Code",
        workspace_id: req.auth.workspace_id,
        is_backup: true,
        starts_at: access_code.starts_at,
        ends_at: access_code.ends_at,
      })
    }

    pulled_backup_access_code_id = backup_access_code.access_code_id
    req.db.setPulledAccessCodeId({
      original_access_code_id: access_code_id,
      pulled_backup_access_code_id,
    })
  }

  backup_access_code = req.db.access_codes.find(
    (ac) => ac.access_code_id === pulled_backup_access_code_id
  )!

  res.status(200).json({ backup_access_code })
})
