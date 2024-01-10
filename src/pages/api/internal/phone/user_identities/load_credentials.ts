import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["POST"],
  jsonBody: z.object({
    hid_invitation_id: z.string().optional().nullable(),
    hid_credential_container_id: z.string().optional().nullable(),
  }),
  jsonResponse: z.object({
    internal_loaded_credentials: z.object({
      hid_invitations: z.array(
        z.object({
          invitation_id: z.string(),
          invitation_code: z.string().optional(),
        }),
      ),
      hid_credential_container: z
        .object({
          ext_hid_credential_container_id: z.string(),
        })
        .optional(),
    }),
  }),
} as const)(async (_req, res) => {
  res.status(500).end("Not implemented!")
})
