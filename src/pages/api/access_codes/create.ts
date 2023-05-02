import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { access_code } from "lib/zod/index.ts"
import { z } from "zod"

export default withRouteSpec({
  auth: "cst_ak_pk",
  methods: ["POST"],
  jsonBody: z.object({
    device_id: z.string(),
    name: z.string().optional(),
    code: z.string().optional(),
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
  })
  res.status(200).json({ access_code })
})
