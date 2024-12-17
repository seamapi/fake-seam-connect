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
  commonParams: z
    .object({
      device_id: z.string().optional(),
      access_code_ids: z.array(z.string()).optional(),
    })
    .refine(
      ({ device_id, access_code_ids }) =>
        Boolean(device_id) || Boolean(access_code_ids),
      "Either 'device_id' or 'access_code_ids' is required",
    ),
  jsonResponse: z.object({
    access_codes: z.array(access_code),
  }),
} as const)(async (req, res) => {
  const { device_id, access_code_ids } = req.commonParams

  res.status(200).json({
    access_codes: req.db.access_codes.filter((ac) =>
      ac.device_id === device_id && access_code_ids != null
        ? access_code_ids.includes(ac.access_code_id)
        : true && !(ac?.is_backup ?? false),
    ),
  })
})
