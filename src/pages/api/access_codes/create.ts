import { z } from "zod"

import { access_code } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z.object({
    device_id: z.string(),
    name: z.string().optional(),
    code: z.string().optional(),
    use_backup_access_code_pool: z.boolean().optional(),
  }),
  jsonResponse: z.object({
    access_code,
  }),
} as const)(async (req, res) => {
  const access_code = req.db.addAccessCode({
    code: req.body.code ?? Math.random().toString().slice(-4),
    device_id: req.body.device_id,
    name: req.body.name ?? "New Access Code",
    workspace_id: req.auth.workspace_id,
    is_backup: req.body.use_backup_access_code_pool ? true : false,
  })
  res.status(200).json({ access_code })
})
