import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  invitation_schema,
  phone_device_metadata_schema,
} from "lib/zod/invitations.ts"

export default withRouteSpec({
  auth: "cst_ak_pk", // TODO: client_session
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
    phone_os: z.enum(["ios", "android"]),
    phone_device_metadata: phone_device_metadata_schema.optional(),
  }),
  jsonResponse: z.object({
    invitations: z.array(invitation_schema),
  }),
} as const)(async (_req, res) => {
  res.status(500).end("Not implemented!")
})
