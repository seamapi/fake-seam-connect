import { z } from "zod"

import { access_code } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

const json_body = z
  .object({
    device_id: z.string(),
    name: z.string().optional(),
    code: z.string().optional(),
    starts_at: z.string().optional(),
    ends_at: z.string().optional(),
    use_backup_access_code_pool: z.boolean().optional(),
  })
  .refine((value) => {
    if (
      !(value.starts_at || value.ends_at) &&
      value.use_backup_access_code_pool
    ) {
      return false
    }

    return true
  }, "Cannot use the backup pool for ongoing codes")

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: json_body,
  jsonResponse: z.object({
    access_code,
  }),
} as const)(async (req, res) => {
  const {
    code,
    device_id,
    name,
    starts_at,
    ends_at,
    use_backup_access_code_pool,
  } = req.body

  const access_code = req.db.addAccessCode({
    code: code ?? Math.random().toString().slice(-4),
    device_id: device_id,
    name: name ?? "New Access Code",
    workspace_id: req.auth.workspace_id,
    ...(starts_at && ends_at
      ? {
          starts_at,
          ends_at,
          type: "time_bound",
          is_backup: use_backup_access_code_pool ? true : false,
        }
      : { type: "ongoing", is_backup: false }),
  })
  res.status(200).json({ access_code })
})
