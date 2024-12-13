import { z } from "zod"

import { access_code } from "lib/zod/index.ts"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: [
    "client_session",
    "pat_with_workspace",
    "console_session_with_workspace",
    "api_key",
  ],
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
      (ac) => ac.device_id === req.commonParams.device_id && !ac.is_managed,
    ),
  })
})
