import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import {
  invitation_schema,
  phone_device_metadata_schema,
} from "lib/zod/invitations.ts"

export default withRouteSpec({
  auth: "client_session",
  methods: ["POST"],
  jsonBody: z.object({
    custom_sdk_installation_id: z.string(),
    phone_os: z.enum(["ios", "android"]),
    phone_device_metadata: phone_device_metadata_schema.optional(),
  }),
  jsonResponse: z.object({
    invitations: z.array(invitation_schema),
  }),
} as const)(async (req, res) => {
  const { client_session_id, workspace_id } = req.auth

  const { custom_sdk_installation_id } = req.body

  const state = req.db.getState()

  const installation = state.getPhoneSdkInstallation({
    ext_sdk_installation_id: custom_sdk_installation_id,
    workspace_id,
    client_session_id,
  })

  if (installation === undefined) {
    state.addPhoneSdkInstallation({
      ext_sdk_installation_id: custom_sdk_installation_id,
      client_session_id,
      workspace_id,
    })
  }

  res.status(500).end("Not implemented!")
})
